import { useCallback, useMemo } from 'react';
import { ResponseType, useApi } from './api.hook';
import { Utils } from '../utils';
import {
  AssignPaymentLink,
  CreatePaymentLink,
  CreatePaymentLinkPayment,
  PaymentLink,
  PaymentLinkConfig,
  PaymentLinkPos,
  PaymentLinksUrl,
  PaymentRoute,
  PaymentRoutes,
  PaymentRoutesUrl,
  PaymentRouteType,
  UpdatePaymentLink,
  UpdatePaymentLinkConfig,
} from '../definitions/route';
import { Sell } from '../definitions/sell';
import { CustomFile } from '../definitions/file';

export interface PaymentRoutesInterface {
  getPaymentRoutes: () => Promise<PaymentRoutes>;
  getPaymentLinks: (
    linkId?: string,
    externalLinkId?: string,
    externalPaymentId?: string,
  ) => Promise<PaymentLink | PaymentLink[]>;
  createPaymentLink: (request: CreatePaymentLink) => Promise<PaymentLink>;
  updatePaymentLink: (
    request: UpdatePaymentLink,
    linkId?: string,
    externalLinkId?: string,
    externalPaymentId?: string,
  ) => Promise<PaymentLink>;
  assignPaymentLink: (request: AssignPaymentLink, linkId?: string, externalLinkId?: string) => Promise<PaymentLink>;
  getUserPaymentLinksConfig: () => Promise<PaymentLinkConfig>;
  updateUserPaymentLinksConfig: (config: UpdatePaymentLinkConfig) => Promise<void>;
  createPaymentLinkPayment: (
    request: CreatePaymentLinkPayment,
    linkId?: string,
    externalLinkId?: string,
  ) => Promise<PaymentLink>;
  cancelPaymentLinkPayment: (
    linkId?: string,
    externalLinkId?: string,
    externalPaymentId?: string,
  ) => Promise<PaymentLink>;
  deletePaymentRoute: (id: number, type: PaymentRouteType) => Promise<PaymentRoute>;
  getPaymentRecipient: (route: string) => Promise<Sell>;
  getPaymentStickers: (
    route: string,
    externalIds?: string,
    ids?: string,
    type?: string,
    mode?: string,
    language?: string,
  ) => Promise<CustomFile>;
  createPosLink: (linkId?: string, externalLinkId?: string, externalPaymentId?: string) => Promise<PaymentLinkPos>;
}

export function usePaymentRoutes(): PaymentRoutesInterface {
  const { call } = useApi();

  const getPaymentRoutes = useCallback(async (): Promise<PaymentRoutes> => {
    return call<PaymentRoutes>({ url: PaymentRoutesUrl.get, method: 'GET' });
  }, [call]);

  const getPaymentLinks = useCallback(
    async (
      linkId?: string,
      externalLinkId?: string,
      externalPaymentId?: string,
    ): Promise<PaymentLink | PaymentLink[]> => {
      const queryParams = Utils.buildQueryParams({ linkId, externalLinkId, externalPaymentId });

      return call<PaymentLink | PaymentLink[]>({
        url: `${PaymentLinksUrl.get}?${queryParams}`,
        method: 'GET',
      });
    },
    [call],
  );

  const createPaymentLink = useCallback(
    async (request: CreatePaymentLink): Promise<PaymentLink> => {
      return call({
        url: PaymentLinksUrl.create,
        method: 'POST',
        data: request,
      });
    },
    [call],
  );

  const updatePaymentLink = useCallback(
    async (
      request: UpdatePaymentLink,
      linkId?: string,
      externalLinkId?: string,
      externalPaymentId?: string,
    ): Promise<PaymentLink> => {
      const queryParams = Utils.buildQueryParams({ linkId, externalLinkId, externalPaymentId });

      return call<PaymentLink>({
        url: `${PaymentLinksUrl.update}?${queryParams}`,
        method: 'PUT',
        data: request,
      });
    },
    [call],
  );

  const assignPaymentLink = useCallback(
    async (request: AssignPaymentLink, linkId?: string, externalLinkId?: string): Promise<PaymentLink> => {
      const queryParams = Utils.buildQueryParams({ linkId, externalLinkId });

      return call<PaymentLink>({
        url: `${PaymentLinksUrl.assign}?${queryParams}`,
        method: 'PUT',
        data: request,
      });
    },
    [call],
  );

  const getUserPaymentLinksConfig = useCallback(async (): Promise<PaymentLinkConfig> => {
    return call<PaymentLinkConfig>({ url: PaymentLinksUrl.userPaymentLinksConfig, method: 'GET' });
  }, [call]);

  const updateUserPaymentLinksConfig = useCallback(
    async (config: UpdatePaymentLinkConfig): Promise<void> => {
      return call<void>({
        url: PaymentLinksUrl.userPaymentLinksConfig,
        method: 'PUT',
        data: config,
      });
    },
    [call],
  );

  const createPaymentLinkPayment = useCallback(
    async (request: CreatePaymentLinkPayment, linkId?: string, externalLinkId?: string): Promise<PaymentLink> => {
      const queryParams = Utils.buildQueryParams({ linkId, externalLinkId });

      return call<PaymentLink>({
        url: `${PaymentLinksUrl.payment}?${queryParams}`,
        method: 'POST',
        data: request,
      });
    },
    [call],
  );

  const cancelPaymentLinkPayment = useCallback(
    async (linkId?: string, externalLinkId?: string, externalPaymentId?: string): Promise<PaymentLink> => {
      const queryParams = Utils.buildQueryParams({ linkId, externalLinkId, externalPaymentId });

      return call<PaymentLink>({
        url: `${PaymentLinksUrl.payment}?${queryParams}`,
        method: 'DELETE',
      });
    },
    [call],
  );

  const deletePaymentRoute = useCallback(
    async (id: number, type: PaymentRouteType): Promise<PaymentRoute> => {
      return call<PaymentRoute>({ url: `${type}/${id}`, method: 'PUT', data: { active: false } });
    },
    [call],
  );

  const createPosLink = useCallback(
    async (linkId?: string, externalLinkId?: string, externalPaymentId?: string): Promise<PaymentLinkPos> => {
      const queryParams = Utils.buildQueryParams({ linkId, externalLinkId, externalPaymentId });

      return call<PaymentLinkPos>({ url: `${PaymentLinksUrl.pos}?${queryParams}`, method: 'PUT' });
    },
    [call],
  );

  const getPaymentRecipient = useCallback(
    async (route: string): Promise<Sell> => {
      return call<Sell>({
        url: PaymentLinksUrl.recipient(route),
        method: 'GET',
      });
    },
    [call],
  );

  const getPaymentStickers = useCallback(
    async (
      route: string,
      externalIds?: string,
      ids?: string,
      type?: string,
      mode?: string,
      language?: string,
    ): Promise<CustomFile> => {
      const params: Record<string, string> = { route };
      if (externalIds) params.externalIds = externalIds;
      if (ids) params.ids = ids;
      if (type) params.type = type;
      if (mode) params.mode = mode;
      if (language) params.lang = language;
      return call<CustomFile>({
        url: `${PaymentLinksUrl.stickers}?${new URLSearchParams(params).toString()}`,
        method: 'GET',
        responseType: ResponseType.BLOB,
      });
    },
    [call],
  );

  return useMemo(
    () => ({
      getPaymentRoutes,
      getPaymentLinks,
      createPaymentLink,
      updatePaymentLink,
      assignPaymentLink,
      getUserPaymentLinksConfig,
      updateUserPaymentLinksConfig,
      createPaymentLinkPayment,
      cancelPaymentLinkPayment,
      deletePaymentRoute,
      getPaymentRecipient,
      getPaymentStickers,
      createPosLink,
    }),
    [
      getPaymentRoutes,
      getPaymentLinks,
      createPaymentLink,
      updatePaymentLink,
      assignPaymentLink,
      getUserPaymentLinksConfig,
      updateUserPaymentLinksConfig,
      createPaymentLinkPayment,
      cancelPaymentLinkPayment,
      deletePaymentRoute,
      getPaymentRecipient,
      getPaymentStickers,
      createPosLink,
    ],
  );
}
