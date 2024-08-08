import { useMemo } from 'react';
import { useApi } from './api.hook';
import { Utils } from '../utils';
import {
  CreatePaymentLink,
  CreatePaymentLinkPayment,
  PaymentLink,
  PaymentLinksUrl,
  PaymentRoutes,
  PaymentRoutesUrl,
  UpdatePaymentLink,
} from '../definitions/route';

export interface PaymentRoutesInterface {
  getPaymentRoutes: () => Promise<PaymentRoutes>;
  getPaymentLinks: (id?: number, externalId?: string) => Promise<PaymentLink | PaymentLink[]>;
  createPaymentLink: (request: CreatePaymentLink) => Promise<PaymentLink>;
  updatePaymentLink: (request: UpdatePaymentLink, id?: number, externalId?: string) => Promise<PaymentLink>;
  createPaymentLinkPayment: (
    request: CreatePaymentLinkPayment,
    id?: number,
    externalId?: string,
  ) => Promise<PaymentLink>;
  cancelPaymentLinkPayment: (id?: number, externalId?: string) => Promise<PaymentLink>;
}

export function usePaymentRoutes(): PaymentRoutesInterface {
  const { call } = useApi();

  async function getPaymentRoutes(): Promise<PaymentRoutes> {
    return call<PaymentRoutes>({ url: PaymentRoutesUrl.get, method: 'GET' });
  }

  async function getPaymentLinks(id?: number, externalId?: string): Promise<PaymentLink | PaymentLink[]> {
    const queryParams = Utils.buildQueryParams({ id, externalId });

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

  async function updatePaymentLink(request: UpdatePaymentLink, id?: number, externalId?: string): Promise<PaymentLink> {
    const queryParams = Utils.buildQueryParams({ id, externalId });

    return call({
      url: `${PaymentLinksUrl.update}?${queryParams}`,
      method: 'PUT',
      data: request,
    });
  }

  async function createPaymentLinkPayment(
    request: CreatePaymentLinkPayment,
    id?: number,
    externalId?: string,
  ): Promise<PaymentLink> {
    const queryParams = Utils.buildQueryParams({ id, externalId });

    return call<PaymentLink>({
      url: `${PaymentLinksUrl.payment}?${queryParams}`,
      method: 'POST',
      data: request,
    });
  }

  async function cancelPaymentLinkPayment(id?: number, externalId?: string): Promise<PaymentLink> {
    const queryParams = Utils.buildQueryParams({ id, externalId });

    return call<PaymentLink>({
      url: `${PaymentLinksUrl.payment}?${queryParams}`,
      method: 'DELETE',
    });
  }

  return useMemo(
    () => ({
      getPaymentRoutes,
      getPaymentLinks,
      createPaymentLink,
      updatePaymentLink,
      createPaymentLinkPayment,
      cancelPaymentLinkPayment,
    }),
    [call],
  );
}
