import { useMemo } from 'react';
import { useApi } from './api.hook';
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
  getPaymentLinks: (id?: number, externalId?: number) => Promise<PaymentLink | PaymentLink[]>;
  createPaymentLink: (request: CreatePaymentLink) => Promise<PaymentLink>;
  updatePaymentLink: (request: UpdatePaymentLink, id?: number, externalId?: number) => Promise<PaymentLink>;
  createPaymentLinkPayment: (
    request: CreatePaymentLinkPayment,
    id?: number,
    externalId?: number,
  ) => Promise<PaymentLink>;
  cancelPaymentLinkPayment: (id?: number, externalId?: number) => Promise<PaymentLink>;
}

export function usePaymentRoutes(): PaymentRoutesInterface {
  const { call } = useApi();

  async function getPaymentRoutes(): Promise<PaymentRoutes> {
    return call<PaymentRoutes>({ url: PaymentRoutesUrl.get, method: 'GET' });
  }

  async function getPaymentLinks(id?: number, externalId?: number): Promise<PaymentLink | PaymentLink[]> {
    return call<PaymentLink | PaymentLink[]>({
      url: `${PaymentLinksUrl.get}?${id ? `id=${id}` : ''}${externalId ? `&externalId=${externalId}` : ''}`,
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

  async function updatePaymentLink(request: UpdatePaymentLink, id?: number, externalId?: number): Promise<PaymentLink> {
    return call({
      url: `${PaymentLinksUrl.update}?${id ? `id=${id}` : ''}${externalId ? `&externalId=${externalId}` : ''}`,
      method: 'PUT',
      data: request,
    });
  }

  async function createPaymentLinkPayment(
    request: CreatePaymentLinkPayment,
    id?: number,
    externalId?: number,
  ): Promise<PaymentLink> {
    return call<PaymentLink>({
      url: `${PaymentLinksUrl.payment}?${id ? `id=${id}` : ''}${externalId ? `&externalId=${externalId}` : ''}`,
      method: 'POST',
      data: request,
    });
  }

  async function cancelPaymentLinkPayment(id?: number, externalId?: number): Promise<PaymentLink> {
    return call<PaymentLink>({
      url: `${PaymentLinksUrl.payment}?${id ? `id=${id}` : ''}${externalId ? `&externalId=${externalId}` : ''}`,
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
