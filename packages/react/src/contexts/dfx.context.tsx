import { PropsWithChildren } from 'react';
import { AssetContextProvider, AssetContextProviderProps } from './asset.context';
import { AuthContextProvider } from './auth.context';
import { BankAccountContextProvider } from './bank-account.context';
import { SessionContextProvider, SessionContextProviderProps } from './session.context';
import { UserContextProvider } from './user.context';
import { FiatContextProvider } from './fiat.context';
import { LanguageContextProvider } from './language.context';
import { PaymentRoutesContextProvider } from './payment-routes.context';
import { SupportChatContextProvider } from './support.context';

type DfxContextProviderProps = SessionContextProviderProps & PropsWithChildren & AssetContextProviderProps;

export function DfxContextProvider(props: DfxContextProviderProps): JSX.Element {
  return (
    <AuthContextProvider>
      <SessionContextProvider api={props.api} data={props.data}>
        <UserContextProvider>
          <FiatContextProvider>
            <LanguageContextProvider>
              <AssetContextProvider includePrivateAssets={props.includePrivateAssets}>
                <SupportChatContextProvider>
                  <PaymentRoutesContextProvider>
                    <BankAccountContextProvider>{props.children}</BankAccountContextProvider>
                  </PaymentRoutesContextProvider>
                </SupportChatContextProvider>
              </AssetContextProvider>
            </LanguageContextProvider>
          </FiatContextProvider>
        </UserContextProvider>
      </SessionContextProvider>
    </AuthContextProvider>
  );
}
