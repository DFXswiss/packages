import { useCallback, useMemo } from 'react';
import { AccountAccessInfo, SupportUrl } from '../definitions/support';
import { useApi } from './api.hook';

export interface AccountAccessInterface {
  setProvisionalApproval: (userDataId: number, enabled: boolean) => Promise<AccountAccessInfo>;
  setVip: (userDataId: number, enabled: boolean) => Promise<AccountAccessInfo>;
}

export function useAccountAccess(): AccountAccessInterface {
  const { call } = useApi();

  const setProvisionalApproval = useCallback(
    async (userDataId: number, enabled: boolean): Promise<AccountAccessInfo> => {
      return call<AccountAccessInfo>({
        url: SupportUrl.provisionalApproval(userDataId),
        method: 'PUT',
        data: { enabled },
      });
    },
    [call],
  );

  const setVip = useCallback(
    async (userDataId: number, enabled: boolean): Promise<AccountAccessInfo> => {
      return call<AccountAccessInfo>({
        url: SupportUrl.vip(userDataId),
        method: 'PUT',
        data: { enabled },
      });
    },
    [call],
  );

  return useMemo(() => ({ setProvisionalApproval, setVip }), [setProvisionalApproval, setVip]);
}
