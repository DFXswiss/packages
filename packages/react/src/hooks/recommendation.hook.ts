import { useCallback, useMemo } from 'react';
import { CreateRecommendation, Recommendation, RecommendationUrl } from '../definitions/recommendation';
import { useApi } from './api.hook';

export interface RecommendationInterface {
  /** Recommendations of the authenticated account, both the ones it sent and the ones it received. */
  getRecommendations: () => Promise<Recommendation[]>;
  createRecommendation: (data: CreateRecommendation) => Promise<Recommendation>;
  /** Accepts a recommendation. The response body is empty; re-read the list for the new status. */
  confirmRecommendation: (id: number) => Promise<void>;
  /** Declines a recommendation. The response body is empty; re-read the list for the new status. */
  rejectRecommendation: (id: number) => Promise<void>;
}

export function useRecommendation(): RecommendationInterface {
  const { call } = useApi();

  const getRecommendations = useCallback(async (): Promise<Recommendation[]> => {
    return call<Recommendation[]>({ url: RecommendationUrl.recommendation, method: 'GET' });
  }, [call]);

  const createRecommendation = useCallback(
    async (data: CreateRecommendation): Promise<Recommendation> => {
      return call<Recommendation>({ url: RecommendationUrl.recommendation, method: 'POST', data });
    },
    [call],
  );

  const confirmRecommendation = useCallback(
    async (id: number): Promise<void> => {
      return call<void>({ url: RecommendationUrl.confirm(id), method: 'PUT' });
    },
    [call],
  );

  const rejectRecommendation = useCallback(
    async (id: number): Promise<void> => {
      return call<void>({ url: RecommendationUrl.reject(id), method: 'PUT' });
    },
    [call],
  );

  return useMemo(
    () => ({ getRecommendations, createRecommendation, confirmRecommendation, rejectRecommendation }),
    [getRecommendations, createRecommendation, confirmRecommendation, rejectRecommendation],
  );
}
