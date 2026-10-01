import { isJobResponse, isJobTerminal, JobStatus } from '../definitions/job';

describe('SDK job response helpers', () => {
  it.each([
    null,
    undefined,
    false,
    42,
    'job',
    [],
    {},
    { status: 'Pending' },
    { uid: 'job' },
    { uid: 42, status: 'Pending' },
    { uid: 'job', status: 42 },
    { kycHash: 'kyc', accessToken: 'access' },
  ])('rejects a value without both string UID and string status: %p', (value) => {
    expect(isJobResponse(value)).toBe(false);
  });

  it.each([
    { uid: 'job', status: JobStatus.PENDING, expectedSeconds: 10 },
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
