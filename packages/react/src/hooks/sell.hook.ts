import { useFiatContext } from '../contexts/fiat.context';
import { Fiat } from '../definitions/fiat';
import { Sell, SellPaymentInfo, SellUrl } from '../definitions/sell';
import { useApi } from './api.hook';

export interface SellInterface {
  receiveFor: (info: SellPaymentInfo) => Promise<Sell>;
  currencies?: Fiat[];
}

export function useSell(): SellInterface {
  const { call } = useApi();
  const { currencies } = useFiatContext();

  async function receiveFor(info: SellPaymentInfo): Promise<Sell> {
    return call<Sell>({ url: SellUrl.receive, method: 'PUT', data: info });
  }

  return { receiveFor, currencies: currencies?.filter((c) => c.buyable) };
}
