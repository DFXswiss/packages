import { useEffect, useMemo, useState } from 'react';
import { useJobContext } from '../contexts/job.context';
import { isJobFinished, Job, JobUrl } from '../definitions/job';
import { useApi } from './api.hook';

export interface UseJobInterface {
  job: Job | undefined;
  isLoading: boolean;
  isOverdue: boolean;
  error: string | undefined;
}

const POLL_DELAYS_MS = [1000, 2000, 5000];
const STEADY_POLL_MS = 5000;
const MAX_TRACKING_MS = 600000;

export function useJob(uid: string | undefined): UseJobInterface {
  const { call } = useApi();
  const jobContext = useJobContext();
  const [job, setJob] = useState<Job | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(uid !== undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    // Effect-scoped guard: shared refs would let a stale fetch from a previous uid write after a re-run.
    let cancelled = false;
    // Once settled (finished job, timeout, or cleanup), no further setJob/setIsLoading/setError from this run.
    let settled = false;
    let fetchInFlight = false;
    let refetchRequested = false;
    let attempt = 0;
    let pollTimer: ReturnType<typeof setTimeout> | undefined;
    let maxTrackingTimer: ReturnType<typeof setTimeout> | undefined;
    let unsubscribeFromContext: (() => void) | undefined;

    const clearPollTimer = () => {
      if (pollTimer !== undefined) {
        clearTimeout(pollTimer);
        pollTimer = undefined;
      }
    };

    const clearMaxTrackingTimer = () => {
      if (maxTrackingTimer !== undefined) {
        clearTimeout(maxTrackingTimer);
        maxTrackingTimer = undefined;
      }
    };

    const stopTracking = () => {
      clearPollTimer();
      clearMaxTrackingTimer();
      if (unsubscribeFromContext !== undefined) {
        unsubscribeFromContext();
        unsubscribeFromContext = undefined;
      }
    };

    if (uid === undefined) {
      setJob(undefined);
      setIsLoading(false);
      setError(undefined);
      return () => {
        cancelled = true;
        settled = true;
        stopTracking();
      };
    }

    setJob(undefined);
    setIsLoading(true);
    setError(undefined);

    // Dedicated cap so a hung fetch cannot prevent the 10-minute timeout from firing.
    maxTrackingTimer = setTimeout(() => {
      if (cancelled || settled) {
        return;
      }
      settled = true;
      setError('Job tracking timed out after 10 minutes');
      setIsLoading(false);
      stopTracking();
    }, MAX_TRACKING_MS);

    const runFetch = async (): Promise<void> => {
      if (cancelled || settled) {
        return;
      }
      if (fetchInFlight) {
        // Coalesce concurrent poll/socket triggers into a single follow-up fetch.
        refetchRequested = true;
        return;
      }

      fetchInFlight = true;
      try {
        for (;;) {
          refetchRequested = false;
          if (cancelled || settled) {
            return;
          }
          try {
            const result = await call<Job>({ url: JobUrl.get(uid), method: 'GET' });
            if (cancelled || settled) {
              return;
            }
            setJob(result);
            setIsLoading(false);
            if (isJobFinished(result.status)) {
              settled = true;
              stopTracking();
              return;
            }
          } catch {
            // Transient poll failures are skipped; the next scheduled interval retries.
          }
          if (!refetchRequested) {
            return;
          }
        }
      } finally {
        fetchInFlight = false;
        if (refetchRequested && !cancelled && !settled) {
          refetchRequested = false;
          void runFetch();
        }
      }
    };

    const scheduleNext = () => {
      if (cancelled || settled) {
        return;
      }

      const delay = attempt < POLL_DELAYS_MS.length ? POLL_DELAYS_MS[attempt] : STEADY_POLL_MS;

      pollTimer = setTimeout(() => {
        void (async () => {
          if (cancelled || settled) {
            return;
          }

          attempt += 1;
          await runFetch();
          if (cancelled || settled) {
            return;
          }
          scheduleNext();
        })();
      }, delay);
    };

    if (jobContext) {
      unsubscribeFromContext = jobContext.subscribe(uid, () => {
        void runFetch();
      });
    }

    scheduleNext();

    return () => {
      cancelled = true;
      settled = true;
      stopTracking();
    };
  }, [uid, call, jobContext]);

  useEffect(() => {
    if (!job || isJobFinished(job.status)) {
      setIsOverdue(false);
      return;
    }
    // expectedSeconds may be absent on the wire; do not invent a default — overdue is false without it.
    if (typeof job.expectedSeconds !== 'number') {
      setIsOverdue(false);
      return;
    }

    // isOverdue depends on the client's local clock relative to the server's created timestamp;
    // a skewed client clock will report overdue early, late, or never.
    const deadline = new Date(job.created).getTime() + job.expectedSeconds * 1000;
    const remainingMs = deadline - Date.now();

    if (remainingMs <= 0) {
      setIsOverdue(true);
      return;
    }

    setIsOverdue(false);
    const timer = setTimeout(() => {
      setIsOverdue(true);
    }, remainingMs);

    return () => {
      clearTimeout(timer);
    };
  }, [job]);

  return useMemo(
    () => ({
      job,
      isLoading,
      isOverdue,
      error,
    }),
    [job, isLoading, isOverdue, error],
  );
}
