import { useEffect, useMemo, useRef, useState } from 'react';
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

  const activeRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const attemptRef = useRef(0);
  const subscribedUidRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    activeRef.current = true;
    attemptRef.current = 0;

    const clearTimer = () => {
      if (timerRef.current !== undefined) {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
    };

    const unsubscribeFromContext = () => {
      if (jobContext && subscribedUidRef.current !== undefined) {
        jobContext.unsubscribe(subscribedUidRef.current);
        subscribedUidRef.current = undefined;
      }
    };

    const stopTracking = () => {
      clearTimer();
      unsubscribeFromContext();
    };

    if (uid === undefined) {
      setJob(undefined);
      setIsLoading(false);
      setError(undefined);
      return () => {
        activeRef.current = false;
        stopTracking();
      };
    }

    setJob(undefined);
    setIsLoading(true);
    setError(undefined);

    const startTime = Date.now();

    const fetchJob = async (): Promise<boolean> => {
      try {
        const result = await call<Job>({ url: JobUrl.get(uid), method: 'GET' });
        if (!activeRef.current) {
          return true;
        }
        setJob(result);
        setIsLoading(false);
        if (isJobFinished(result.status)) {
          stopTracking();
          return true;
        }
        return false;
      } catch {
        // Transient poll failures are skipped; the next scheduled interval retries.
        return false;
      }
    };

    const scheduleNext = () => {
      if (!activeRef.current) {
        return;
      }

      const delay = attemptRef.current < POLL_DELAYS_MS.length ? POLL_DELAYS_MS[attemptRef.current] : STEADY_POLL_MS;

      timerRef.current = setTimeout(() => {
        void (async () => {
          if (!activeRef.current) {
            return;
          }

          if (Date.now() - startTime >= MAX_TRACKING_MS) {
            if (activeRef.current) {
              setError('Job tracking timed out after 10 minutes');
              setIsLoading(false);
            }
            stopTracking();
            return;
          }

          attemptRef.current += 1;
          const finished = await fetchJob();
          if (!activeRef.current || finished) {
            return;
          }
          scheduleNext();
        })();
      }, delay);
    };

    if (jobContext) {
      jobContext.subscribe(uid, () => {
        void fetchJob();
      });
      subscribedUidRef.current = uid;
    }

    scheduleNext();

    return () => {
      activeRef.current = false;
      stopTracking();
    };
  }, [uid, call, jobContext]);

  const isOverdue = useMemo(() => {
    if (!job || isJobFinished(job.status)) {
      return false;
    }
    // expectedSeconds may be absent on the wire; do not invent a default — overdue is false without it.
    if (typeof job.expectedSeconds !== 'number') {
      return false;
    }
    return Date.now() - new Date(job.created).getTime() > job.expectedSeconds * 1000;
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
