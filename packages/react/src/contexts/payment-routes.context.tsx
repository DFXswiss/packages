import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import {
  CreatePaymentLink,
  CreatePaymentLinkPayment,
  PaymentLink,
  PaymentRoute,
  PaymentRoutes,
  UpdatePaymentLink,
} from '../definitions/route';
import { usePaymentRoutes } from '../hooks/payment-routes.hook';
import { ApiError } from '../definitions/error';
import { useUserContext } from './user.context';

interface PaymentRoutesInterface {
  paymentRoutes?: PaymentRoutes;
  paymentLinks?: PaymentLink[];
  paymentRoutesLoading: boolean;
  paymentLinksLoading: boolean;
  createPaymentLink: (request: CreatePaymentLink) => Promise<void>;
  updatePaymentLink: (request: UpdatePaymentLink, id?: number, externalId?: string) => Promise<void>;
  createPaymentLinkPayment: (request: CreatePaymentLinkPayment, id?: number, externalId?: string) => Promise<void>;
  cancelPaymentLinkPayment: (id?: number, externalId?: string) => Promise<void>;
  error?: string;
}

const PaymentRoutesContext = createContext<PaymentRoutesInterface>(undefined as any);

export function usePaymentRoutesContext(): PaymentRoutesInterface {
  return useContext(PaymentRoutesContext);
}

export function PaymentRoutesContextProvider(props: PropsWithChildren): JSX.Element {
  const { user } = useUserContext();
  const {
    getPaymentRoutes,
    getPaymentLinks,
    createPaymentLink: createPaymentLinkApi,
    updatePaymentLink: updatePaymentLinkApi,
    createPaymentLinkPayment: createPaymentLinkPaymentApi,
    cancelPaymentLinkPayment: cancelPaymentLinkPaymentApi,
  } = usePaymentRoutes();
  const [error, setError] = useState<string | undefined>();
  const [paymentRoutes, setPaymentRoutes] = useState<PaymentRoutes>();
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>();
  const [paymentRoutesLoading, setPaymentRoutesLoading] = useState<boolean>(false);
  const [paymentLinksLoading, setPaymentLinksLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      setPaymentRoutes(undefined);
      setPaymentLinks(undefined);
      return;
    }

    // get routes
    setPaymentRoutesLoading(true);
    getPaymentRoutes()
      .then((routes: PaymentRoutes) => {
        routes.buy = routes.buy.filter((route) => route.active).sort(sortRoutes);
        routes.sell = routes.sell.filter((route) => route.active).sort(sortRoutes);
        routes.swap = routes.swap.filter((route) => route.active).sort(sortRoutes);
        setPaymentRoutes(routes);
      })
      .catch((error: ApiError) => setError(error.message ?? 'Unknown error'))
      .finally(() => setPaymentRoutesLoading(false));

    // get payment links
    setPaymentLinksLoading(true);
    getPaymentLinks()
      .then((links) => setPaymentLinks(links as PaymentLink[]))
      .catch((error: ApiError) => setError(error.message ?? 'Unknown error'))
      .finally(() => setPaymentLinksLoading(false));
  }, [user]);

  async function createPaymentLink(request: CreatePaymentLink): Promise<void> {
    if (!user) return;

    setPaymentLinksLoading(true);
    return createPaymentLinkApi(request)
      .then(updatePaymentLinks)
      .finally(() => setPaymentLinksLoading(false));
  }

  async function updatePaymentLink(request: UpdatePaymentLink, id?: number, externalId?: string): Promise<void> {
    if (!user) return;

    setPaymentLinksLoading(true);
    return updatePaymentLinkApi(request, id, externalId)
      .then(updatePaymentLinks)
      .finally(() => setPaymentLinksLoading(false));
  }

  async function createPaymentLinkPayment(
    request: CreatePaymentLinkPayment,
    id?: number,
    externalId?: string,
  ): Promise<void> {
    if (!user) return;

    setPaymentLinksLoading(true);
    return createPaymentLinkPaymentApi(request, id, externalId)
      .then(updatePaymentLinks)
      .finally(() => setPaymentLinksLoading(false));
  }

  async function cancelPaymentLinkPayment(id?: number, externalId?: string): Promise<void> {
    if (!user) return;

    setPaymentLinksLoading(true);
    return cancelPaymentLinkPaymentApi(id, externalId)
      .then(updatePaymentLinks)
      .finally(() => setPaymentLinksLoading(false));
  }

  function updatePaymentLinks(paymentLink: PaymentLink): void {
    setPaymentLinks((links) => {
      if (!links) return [paymentLink];
      const index = links.findIndex((l) => l.id === paymentLink.id);
      if (index !== -1) {
        links[index] = paymentLink;
      } else {
        links.push(paymentLink);
      }
      return links;
    });
  }

  function sortRoutes(a: PaymentRoute, b: PaymentRoute): number {
    if ('asset' in a && 'asset' in b) {
      return a.asset.blockchain.localeCompare(b.asset.blockchain);
    } else if ('currency' in a && 'currency' in b) {
      return a.currency.name.localeCompare(b.currency.name);
    } else {
      return 0;
    }
  }

  const context: PaymentRoutesInterface = useMemo(
    () => ({
      paymentRoutes,
      paymentRoutesLoading,
      paymentLinks,
      paymentLinksLoading,
      createPaymentLink,
      updatePaymentLink,
      createPaymentLinkPayment,
      cancelPaymentLinkPayment,
      error,
    }),
    [
      user,
      paymentRoutes,
      paymentRoutesLoading,
      paymentLinks,
      paymentLinksLoading,
      error,
      createPaymentLink,
      updatePaymentLink,
      createPaymentLinkPayment,
      cancelPaymentLinkPayment,
    ],
  );

  return <PaymentRoutesContext.Provider value={context}>{props.children}</PaymentRoutesContext.Provider>;
}
