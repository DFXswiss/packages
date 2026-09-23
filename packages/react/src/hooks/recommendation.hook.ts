import { useCallback, useMemo } from 'react';
import { CreateRecommendation, Recommendation } from '../definitions/recommendation';
import { useApi } from './api.hook';

export interface RecommendationInterface {
  getRecommendations: () => Promise<Recommendation[]>;
  createRecommendation: (data: CreateRecommendation) => Promise<Recommendation>;
  confirmRecommendation: (id: number) => Promise<void>;
  rejectRecommendation: (id: number) => Promise<void>;
}

export function useRecommendation(): RecommendationInterface {
  const { call } = useApi();

  const getRecommendations = useCallback(async (): Promise<Recommendation[]> => {
    return call<Recommendation[]>({ url: 'recommendation', method: 'GET' });
  }, [call]);

  const createRecommendation = useCallback(
    async (data: CreateRecommendation): Promise<Recommendation> => {
      return call<Recommendation>({ url: 'recommendation', method: 'POST', data });
    },
    [call],
  );

  const confirmRecommendation = useCallback(
    async (id: number): Promise<void> => {
      return call<void>({ url: `recommendation/${id}/confirm`, method: 'PUT' });
    },
    [call],
  );

  const rejectRecommendation = useCallback(
    async (id: number): Promise<void> => {
      return call<void>({ url: `recommendation/${id}/reject`, method: 'PUT' });
    },
    [call],
  );

  return useMemo(
    () => ({ getRecommendations, createRecommendation, confirmRecommendation, rejectRecommendation }),
    [getRecommendations, createRecommendation, confirmRecommendation, rejectRecommendation],
  );
}
