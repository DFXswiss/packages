import { PropsWithChildren } from 'react';
import { AssetContextProvider } from './asset.context';
import { AuthContextProvider } from './auth.context';
import { BankAccountContextProvider } from './bank-account.context';
import { SessionContextProvider, SessionContextProviderProps } from './session.context';
import { UserContextProvider } from './user.context';
import { FiatContextProvider } from './fiat.context';
import { LanguageContextProvider } from './language.context';

type DfxContextProviderProps = SessionContextProviderProps & PropsWithChildren;

export function DfxContextProvider(props: DfxContextProviderProps): JSX.Element {
  return (
    <AuthContextProvider>
      <SessionContextProvider api={props.api} data={props.data}>
        <UserContextProvider>
          <FiatContextProvider>
            <LanguageContextProvider>
              <AssetContextProvider>
                <BankAccountContextProvider>{props.children}</BankAccountContextProvider>
              </AssetContextProvider>
            </LanguageContextProvider>
          </FiatContextProvider>
        </UserContextProvider>
      </SessionContextProvider>
    </AuthContextProvider>
  );
}
