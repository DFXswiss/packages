import { useMemo } from 'react';
import { useApi } from './api.hook';
import { RoutesDto, RouteUrl } from '../definitions/route';

export interface RouteInterface {
  getRoutes: () => Promise<RoutesDto>;
}

export function useRoute(): RouteInterface {
  const { call } = useApi();

  async function getRoutes(): Promise<RoutesDto> {
    return call<RoutesDto>({ url: RouteUrl.get, method: 'GET' });
  }

  return useMemo(() => ({ getRoutes }), [call]);
}
