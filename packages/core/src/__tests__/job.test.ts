import { isJobResponse, isJobTerminal, JobStatus } from '..';
import type { JobResponse } from '..';

describe('core job response helpers', () => {
  it.each([
    { value: null },
    { value: undefined },
    { value: false },
    { value: 42 },
    { value: 'job' },
    { value: [] },
    { value: {} },
    { value: { status: 'Pending' } },
    { value: { uid: 42, status: 'Pending' } },
    { value: { uid: 'job' } },
    { value: { uid: 'job', status: 42 } },
    { value: { kycHash: 'kyc', accessToken: 'access' } },
  ])('rejects a value without both string UID and string status: $value', ({ value }) => {
    expect(isJobResponse(value)).toBe(false);
  });

  it('recognizes a valid job ticket through the public package exports', () => {
    const ticket: JobResponse = { uid: 'job', status: JobStatus.PENDING, expectedSeconds: 10 };

    expect(isJobResponse(ticket)).toBe(true);
  });

  it.each([
    { uid: 'job', status: JobStatus.FAILED, expectedSeconds: 0, error: 'Merge failed' },
    { uid: 'job', status: 'FutureStatus' },
    { uid: '', status: '' },
  ])('recognizes string UID and status without requiring other fields: %p', (value) => {
    expect(isJobResponse(value)).toBe(true);
  });

  it.each([
    [JobStatus.PENDING, false],
    [JobStatus.PROCESSING, false],
    [JobStatus.COMPLETE, true],
    [JobStatus.RETRY, false],
    [JobStatus.FAILED, true],
    [JobStatus.DEAD_LETTER, true],
  ])('classifies %s as terminal=%s', (status, terminal) => {
    expect(isJobTerminal(status)).toBe(terminal);
  });
});
