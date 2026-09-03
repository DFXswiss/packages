import { JobApi } from '../client/JobApi';
import { DfxHttpClient } from '../client/DfxHttpClient';
import { isJobFinished, Job, JobStatus } from '../definitions/job';

function createMockHttpClient(response?: unknown) {
  const requestMock = jest.fn().mockResolvedValue(response);

  return {
    request: requestMock,
    requestAbsolute: jest.fn(),
    getBaseUrl: jest.fn().mockReturnValue('https://api.dfx.swiss'),
    getApiUrl: jest.fn().mockReturnValue('https://api.dfx.swiss/v1'),
    setToken: jest.fn(),
    getToken: jest.fn(),
  } as unknown as DfxHttpClient & { request: jest.Mock };
}

describe('JobApi', () => {
  describe('get', () => {
    it('requests job by uid and resolves with the job payload', async () => {
      const job: Job = {
        uid: 'J7f3a9c2e1b8d4a60',
        group: 'AccountMerge',
        status: JobStatus.PENDING,
        created: new Date('2026-07-30T08:12:44.000Z'),
        expectedSeconds: 65,
      };
      const mockHttp = createMockHttpClient(job);
      const api = new JobApi(mockHttp);

      const result = await api.get(job.uid);

      expect(result).toEqual(job);
      expect(result.uid).toBe('J7f3a9c2e1b8d4a60');
      expect(result.group).toBe('AccountMerge');
      expect(result.status).toBe(JobStatus.PENDING);
      expect(result.created).toEqual(new Date('2026-07-30T08:12:44.000Z'));
      expect(result.expectedSeconds).toBe(65);
      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'job/J7f3a9c2e1b8d4a60', method: 'GET' });
    });

    it('resolves a job payload that omits expectedSeconds', async () => {
      const job: Job = {
        uid: 'J9a1b2c3d4e5f6071',
        group: 'AccountMerge',
        status: JobStatus.PROCESSING,
        created: new Date('2026-07-30T09:00:00.000Z'),
      };
      const mockHttp = createMockHttpClient(job);
      const api = new JobApi(mockHttp);

      const result = await api.get(job.uid);

      expect(result).toEqual(job);
      expect(result.uid).toBe('J9a1b2c3d4e5f6071');
      expect(result.group).toBe('AccountMerge');
      expect(result.status).toBe(JobStatus.PROCESSING);
      expect(result.created).toEqual(new Date('2026-07-30T09:00:00.000Z'));
      expect(result.expectedSeconds).toBeUndefined();
      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'job/J9a1b2c3d4e5f6071', method: 'GET' });
    });
  });
});

describe('isJobFinished', () => {
  it.each([
    [JobStatus.PENDING, false],
    [JobStatus.PROCESSING, false],
    [JobStatus.COMPLETE, true],
    [JobStatus.FAILED, true],
    [JobStatus.DEAD_LETTER, true],
  ])('status %s → finished=%s', (status, expected) => {
    expect(isJobFinished(status)).toBe(expected);
  });
});
