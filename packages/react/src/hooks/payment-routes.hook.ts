import { useMemo } from 'react';
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

  async function getPaymentRoutes(): Promise<PaymentRoutes> {
    return call<PaymentRoutes>({ url: PaymentRoutesUrl.get, method: 'GET' });
  }

  async function getPaymentLinks(
    linkId?: string,
    externalLinkId?: string,
    externalPaymentId?: string,
  ): Promise<PaymentLink | PaymentLink[]> {
    const queryParams = Utils.buildQueryParams({ linkId, externalLinkId, externalPaymentId });

    return call<PaymentLink | PaymentLink[]>({
      url: queryParams ? `${PaymentLinksUrl.get}?${queryParams}` : PaymentLinksUrl.get,
      method: 'GET',
    });
  }

  async function createPaymentLink(request: CreatePaymentLink): Promise<PaymentLink> {
    return call({
      url: PaymentLinksUrl.create,
      method: 'POST',
      data: request,
    });
  }

  async function updatePaymentLink(
    request: UpdatePaymentLink,
    linkId?: string,
    externalLinkId?: string,
    externalPaymentId?: string,
  ): Promise<PaymentLink> {
    const queryParams = Utils.buildQueryParams({ linkId, externalLinkId, externalPaymentId });

    return call<PaymentLink>({
      url: queryParams ? `${PaymentLinksUrl.update}?${queryParams}` : PaymentLinksUrl.update,
      method: 'PUT',
      data: request,
    });
  }

  async function assignPaymentLink(
    request: AssignPaymentLink,
    linkId?: string,
    externalLinkId?: string,
  ): Promise<PaymentLink> {
    const queryParams = Utils.buildQueryParams({ linkId, externalLinkId });

    return call<PaymentLink>({
      url: queryParams ? `${PaymentLinksUrl.assign}?${queryParams}` : PaymentLinksUrl.assign,
      method: 'PUT',
      data: request,
    });
  }

  async function getUserPaymentLinksConfig(): Promise<PaymentLinkConfig> {
    return call<PaymentLinkConfig>({ url: PaymentLinksUrl.userPaymentLinksConfig, method: 'GET' });
  }

  async function updateUserPaymentLinksConfig(config: UpdatePaymentLinkConfig): Promise<void> {
    return call<void>({
      url: PaymentLinksUrl.userPaymentLinksConfig,
      method: 'PUT',
      data: config,
    });
  }

  async function createPaymentLinkPayment(
    request: CreatePaymentLinkPayment,
    linkId?: string,
    externalLinkId?: string,
  ): Promise<PaymentLink> {
    const queryParams = Utils.buildQueryParams({ linkId, externalLinkId });

    return call<PaymentLink>({
      url: queryParams ? `${PaymentLinksUrl.payment}?${queryParams}` : PaymentLinksUrl.payment,
      method: 'POST',
      data: request,
    });
  }

  async function cancelPaymentLinkPayment(
    linkId?: string,
    externalLinkId?: string,
    externalPaymentId?: string,
  ): Promise<PaymentLink> {
    const queryParams = Utils.buildQueryParams({ linkId, externalLinkId, externalPaymentId });

    return call<PaymentLink>({
      url: queryParams ? `${PaymentLinksUrl.payment}?${queryParams}` : PaymentLinksUrl.payment,
      method: 'DELETE',
    });
  }

  async function deletePaymentRoute(id: number, type: PaymentRouteType): Promise<PaymentRoute> {
    return call<PaymentRoute>({ url: `${type}/${id}`, method: 'PUT', data: { active: false } });
  }

  async function createPosLink(
    linkId?: string,
    externalLinkId?: string,
    externalPaymentId?: string,
  ): Promise<PaymentLinkPos> {
    const queryParams = Utils.buildQueryParams({ linkId, externalLinkId, externalPaymentId });

    return call<PaymentLinkPos>({ url: queryParams ? `${PaymentLinksUrl.pos}?${queryParams}` : PaymentLinksUrl.pos, method: 'PUT' });
  }

  async function getPaymentRecipient(route: string): Promise<Sell> {
    return call<Sell>({
      url: PaymentLinksUrl.recipient(route),
      method: 'GET',
    });
  }

  async function getPaymentStickers(
    route: string,
    externalIds?: string,
    ids?: string,
    type?: string,
    mode?: string,
    language?: string,
  ): Promise<CustomFile> {
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
  }

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
    [call],
  );
}
