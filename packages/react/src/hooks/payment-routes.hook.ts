import { useMemo } from 'react';
import { useApi } from './api.hook';
import { Utils } from '../utils';
import {
  CreatePaymentLink,
  CreatePaymentLinkPayment,
  PaymentLink,
  PaymentLinksUrl,
  PaymentRoute,
  PaymentRoutes,
  PaymentRoutesUrl,
  PaymentRouteType,
  UpdatePaymentLink,
} from '../definitions/route';

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
      url: `${PaymentLinksUrl.get}?${queryParams}`,
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
      url: `${PaymentLinksUrl.update}?${queryParams}`,
      method: 'PUT',
      data: request,
    });
  }

  async function createPaymentLinkPayment(
    request: CreatePaymentLinkPayment,
    linkId?: string,
    externalLinkId?: string,
  ): Promise<PaymentLink> {
    const queryParams = Utils.buildQueryParams({ linkId, externalLinkId });

    return call<PaymentLink>({
      url: `${PaymentLinksUrl.payment}?${queryParams}`,
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
      url: `${PaymentLinksUrl.payment}?${queryParams}`,
      method: 'DELETE',
    });
  }

  async function deletePaymentRoute(id: number, type: PaymentRouteType): Promise<PaymentRoute> {
    return call<PaymentRoute>({ url: `${type}/${id}`, method: 'PUT', data: { active: false } });
  }

  return useMemo(
    () => ({
      getPaymentRoutes,
      getPaymentLinks,
      createPaymentLink,
      updatePaymentLink,
      createPaymentLinkPayment,
      cancelPaymentLinkPayment,
      deletePaymentRoute,
    }),
    [call],
  );
}
