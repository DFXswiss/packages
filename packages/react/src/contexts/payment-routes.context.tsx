import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import {
  CreatePaymentLink,
  CreatePaymentLinkPayment,
  PaymentLink,
  PaymentRoute,
  PaymentRoutes,
  PaymentRouteType,
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
  createPaymentLink: (request: CreatePaymentLink) => Promise<PaymentLink | undefined>;
  updatePaymentLink: (request: UpdatePaymentLink, id?: number, externalId?: string) => Promise<void>;
  createPaymentLinkPayment: (request: CreatePaymentLinkPayment, id?: number, externalId?: string) => Promise<void>;
  cancelPaymentLinkPayment: (id?: number, externalId?: string) => Promise<void>;
  deletePaymentRoute: (id: number, type: PaymentRouteType) => Promise<void>;
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
    deletePaymentRoute: deletePaymentRouteApi,
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

    loadPaymentRoutes();
    loadPaymentLinks();
  }, [user]);

  async function createPaymentLink(request: CreatePaymentLink): Promise<PaymentLink | undefined> {
    if (!user) return;

    setPaymentLinksLoading(true);
    try {
      const paymentLink = await createPaymentLinkApi(request);
      updatePaymentLinks(paymentLink);
      return paymentLink;
    } finally {
      setPaymentLinksLoading(false);
    }
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

  async function deletePaymentRoute(id: number, type: PaymentRouteType): Promise<void> {
    if (!user) return;

    setPaymentRoutesLoading(true);
    return deletePaymentRouteApi(id, type)
      .then(() => {
        setPaymentRoutes((routes) => {
          if (!routes) return;
          if (type === 'buy') routes.buy = routes.buy.filter((route) => route.id !== id);
          else if (type === 'sell') routes.sell = routes.sell.filter((route) => route.id !== id);
          else if (type === 'swap') routes.swap = routes.swap.filter((route) => route.id !== id);
          return routes;
        });
      })
      .then(loadPaymentLinks)
      .finally(() => setPaymentRoutesLoading(false));
  }

  async function loadPaymentRoutes(): Promise<void> {
    if (!user) return;

    setPaymentRoutesLoading(true);
    return getPaymentRoutes()
      .then((routes: PaymentRoutes) => {
        routes.buy = routes.buy.filter((route) => route.active).sort(sortRoutes);
        routes.sell = routes.sell.filter((route) => route.active).sort(sortRoutes);
        routes.swap = routes.swap.filter((route) => route.active).sort(sortRoutes);
        setPaymentRoutes(routes);
      })
      .catch((error: ApiError) => setError(error.message ?? 'Unknown error'))
      .finally(() => setPaymentRoutesLoading(false));
  }

  async function loadPaymentLinks(): Promise<void> {
    if (!user) return;

    setPaymentLinksLoading(true);
    return getPaymentLinks()
      .then((links) => setPaymentLinks(links as PaymentLink[]))
      .catch((error: ApiError) => {
        if (error.message === 'permission denied') {
          setPaymentLinks([]);
        } else {
          setError(error.message ?? 'Unknown error');
        }
      })
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
      deletePaymentRoute,
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
      deletePaymentRoute,
    ],
  );

  return <PaymentRoutesContext.Provider value={context}>{props.children}</PaymentRoutesContext.Provider>;
}
