import { SupportMessage, SupportMessageStatus } from '../definitions/support';
import { lastSettledMessageId, mergeMessages, prepareRetry, settleMessage } from '../support-messages';

function msg(id: number, overrides: Partial<SupportMessage> = {}): SupportMessage {
  return {
    id,
    created: new Date('2026-01-01T00:00:00.000Z'),
    message: `m-${id}`,
    ...overrides,
  };
}

describe('lastSettledMessageId', () => {
  it('returns undefined for an empty array', () => {
    expect(lastSettledMessageId([])).toBeUndefined();
  });

  it('returns undefined when only negative placeholder ids are present', () => {
    expect(lastSettledMessageId([msg(-1), msg(-2)])).toBeUndefined();
  });

  it('returns the highest positive id among mixed messages', () => {
    expect(lastSettledMessageId([msg(3), msg(-1), msg(7), msg(-2), msg(2)])).toBe(7);
  });

  it('returns the highest positive id even when input is unsorted', () => {
    expect(lastSettledMessageId([msg(5), msg(12), msg(1), msg(9)])).toBe(12);
  });
});

describe('mergeMessages', () => {
  it('does not insert messages that already exist by id', () => {
    const current = [msg(1), msg(2)];
    const incoming = [msg(2, { message: 'updated' }), msg(3)];
    const result = mergeMessages(current, incoming);

    expect(result).toHaveLength(3);
    expect(result.map((m) => m.id)).toEqual([1, 2, 3]);
    expect(result[1].message).toBe('m-2');
  });

  it('does not mutate the input array (reference and content)', () => {
    const current = [msg(1)];
    const incoming = [msg(2)];
    const currentSnapshot = current.slice();
    const currentRef = current;

    const result = mergeMessages(current, incoming);

    expect(current).toBe(currentRef);
    expect(current).toEqual(currentSnapshot);
    expect(current).toHaveLength(1);
    expect(result).not.toBe(current);
    expect(result).toHaveLength(2);
  });

  it('always returns a new array even when nothing is added', () => {
    const current = [msg(1)];
    const result = mergeMessages(current, [msg(1)]);

    expect(result).not.toBe(current);
    expect(result).toEqual(current);
  });
});

describe('settleMessage', () => {
  it('settles the message at position 0 by id (not index falsy-check)', () => {
    const messages = [msg(-1, { status: SupportMessageStatus.SENT }), msg(5)];
    const settled = msg(42, { message: 'from-server' });

    const result = settleMessage(messages, -1, settled);

    expect(result[0].id).toBe(42);
    expect(result[0].status).toBe(SupportMessageStatus.RECEIVED);
    expect(result[0].message).toBe('from-server');
    expect(result[1].id).toBe(5);
  });

  it('sets status Received when a settled message is provided', () => {
    const messages = [msg(1), msg(-2, { status: SupportMessageStatus.SENT })];
    const result = settleMessage(messages, -2, msg(99));

    expect(result[1].status).toBe(SupportMessageStatus.RECEIVED);
    expect(result[1].id).toBe(99);
  });

  it('sets status Failed when no settled message is provided', () => {
    const messages = [msg(-3, { status: SupportMessageStatus.SENT })];
    const result = settleMessage(messages, -3);

    expect(result[0].status).toBe(SupportMessageStatus.FAILED);
    expect(result[0].id).toBe(-3);
  });

  it('returns a new unchanged array when the id is unknown', () => {
    const messages = [msg(1), msg(2)];
    const result = settleMessage(messages, -99, msg(50));

    expect(result).not.toBe(messages);
    expect(result).toEqual(messages);
  });

  it('settles two consecutive calls against different temp ids independently', () => {
    const messages = [
      msg(-1, { status: SupportMessageStatus.SENT, message: 'first' }),
      msg(-2, { status: SupportMessageStatus.SENT, message: 'second' }),
    ];

    const afterFirst = settleMessage(messages, -1, msg(10, { message: 'first-ok' }));
    const afterSecond = settleMessage(afterFirst, -2, msg(11, { message: 'second-ok' }));

    expect(afterSecond[0]).toMatchObject({ id: 10, status: SupportMessageStatus.RECEIVED, message: 'first-ok' });
    expect(afterSecond[1]).toMatchObject({ id: 11, status: SupportMessageStatus.RECEIVED, message: 'second-ok' });
  });

  it('drops the optimistic entry when settled.id already exists from a prior sync', () => {
    // submitMessage optimistically inserts -1; sync merges server 101 before createMessage returns
    const messages = [
      msg(100, { message: 'prior' }),
      msg(-1, { status: SupportMessageStatus.SENT, message: 'optimistic' }),
      msg(101, { message: 'from-sync' }),
    ];
    const inputRef = messages;

    const result = settleMessage(messages, -1, msg(101, { message: 'from-create' }));

    expect(result).not.toBe(inputRef);
    expect(result.map((m) => m.id)).toEqual([100, 101]);
    expect(result.filter((m) => m.id === 101)).toHaveLength(1);
    expect(result[1].message).toBe('from-sync');
  });

  it('replaces the optimistic entry when settled.id is not yet present', () => {
    const messages = [msg(100), msg(-1, { status: SupportMessageStatus.SENT, message: 'optimistic' })];

    const result = settleMessage(messages, -1, msg(101, { message: 'from-create' }));

    expect(result.map((m) => m.id)).toEqual([100, 101]);
    expect(result[1]).toMatchObject({
      id: 101,
      status: SupportMessageStatus.RECEIVED,
      message: 'from-create',
    });
  });
});

describe('prepareRetry', () => {
  it('is a no-op for an unknown id', () => {
    const messages = [msg(1, { status: SupportMessageStatus.FAILED })];
    const result = prepareRetry(messages, -99);

    expect(result.payload).toBeUndefined();
    expect(result.messages).not.toBe(messages);
    expect(result.messages).toEqual(messages);
  });

  it('is a no-op for a non-failed message', () => {
    const messages = [
      msg(1),
      msg(-1, { status: SupportMessageStatus.SENT, message: 'in-flight' }),
      msg(-2, { status: SupportMessageStatus.RECEIVED, message: 'done' }),
    ];

    expect(prepareRetry(messages, -1).payload).toBeUndefined();
    expect(prepareRetry(messages, -2).payload).toBeUndefined();
    expect(prepareRetry(messages, -1).messages.map((m) => m.status)).toEqual([
      undefined,
      SupportMessageStatus.SENT,
      SupportMessageStatus.RECEIVED,
    ]);
  });

  it('claims a failed message in place as Sent and returns its payload', () => {
    const failed = msg(-1, {
      status: SupportMessageStatus.FAILED,
      message: 'customer text',
      fileName: 'shot.png',
      file: { file: 'base64', type: 'image/png', size: 4, url: 'blob:x' },
    });
    const messages = [msg(100, { message: 'prior' }), failed, msg(50, { message: 'other' })];

    const result = prepareRetry(messages, -1);

    expect(result.payload).toEqual(failed);
    expect(result.messages.map((m) => m.id)).toEqual([100, -1, 50]);
    expect(result.messages[1].status).toBe(SupportMessageStatus.SENT);
    expect(result.messages[1].message).toBe('customer text');
    expect(result.messages[0].status).toBeUndefined();
    expect(result.messages).not.toBe(messages);
  });

  it('success path: settle after prepare keeps position and applies server data', () => {
    const messages = [
      msg(100),
      msg(-1, { status: SupportMessageStatus.FAILED, message: 'retry-me' }),
      msg(99, { message: 'tail' }),
    ];

    const prepared = prepareRetry(messages, -1);
    expect(prepared.payload?.message).toBe('retry-me');

    const settled = settleMessage(prepared.messages, -1, msg(200, { message: 'from-server' }));

    expect(settled.map((m) => m.id)).toEqual([100, 200, 99]);
    expect(settled[1]).toMatchObject({
      id: 200,
      status: SupportMessageStatus.RECEIVED,
      message: 'from-server',
    });
  });

  it('failure path: settle without server data returns to Failed in place', () => {
    const messages = [msg(100), msg(-1, { status: SupportMessageStatus.FAILED, message: 'retry-me' })];

    const prepared = prepareRetry(messages, -1);
    const failedAgain = settleMessage(prepared.messages, -1);

    expect(failedAgain.map((m) => m.id)).toEqual([100, -1]);
    expect(failedAgain[1]).toMatchObject({
      id: -1,
      status: SupportMessageStatus.FAILED,
      message: 'retry-me',
    });
  });

  it('duplicate path: settle after prepare drops optimistic when sync already has settled.id', () => {
    const messages = [
      msg(100),
      msg(-1, { status: SupportMessageStatus.FAILED, message: 'optimistic' }),
      msg(101, { message: 'from-sync' }),
    ];

    const prepared = prepareRetry(messages, -1);
    expect(prepared.messages[1].status).toBe(SupportMessageStatus.SENT);

    const result = settleMessage(prepared.messages, -1, msg(101, { message: 'from-create' }));

    expect(result.map((m) => m.id)).toEqual([100, 101]);
    expect(result.filter((m) => m.id === 101)).toHaveLength(1);
    expect(result[1].message).toBe('from-sync');
  });

  it('second prepareRetry on the same id is a no-op (already Sent)', () => {
    const messages = [msg(-1, { status: SupportMessageStatus.FAILED, message: 'once' })];
    const first = prepareRetry(messages, -1);
    const second = prepareRetry(first.messages, -1);

    expect(first.payload).toBeDefined();
    expect(second.payload).toBeUndefined();
    expect(second.messages[0].status).toBe(SupportMessageStatus.SENT);
  });
});
