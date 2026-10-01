import { useCallback, useMemo } from 'react';
import { JobResponse } from '../definitions/job';
import { useApi } from './api.hook';

export interface JobInterface {
  getJob: (uid: string, authenticated?: boolean) => Promise<JobResponse>;
}

export function useJob(): JobInterface {
  const { call } = useApi();

  const getJob = useCallback(
    async (uid: string, authenticated = false): Promise<JobResponse> => {
      return call<JobResponse>({
        url: `job/${encodeURIComponent(uid)}`,
        method: 'GET',
        ...(authenticated === true ? {} : { token: false }),
      });
    },
    [call],
  );

  return useMemo(() => ({ getJob }), [getJob]);
}
