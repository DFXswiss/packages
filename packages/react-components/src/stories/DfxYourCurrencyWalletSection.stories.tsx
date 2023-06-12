import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Asset } from '../definitions/asset';
import { Fiat } from '../definitions/fiat';
import DfxYourCurrencyWalletSection from './DfxYourCurrencyWalletSection';

export default {
  title: 'Composites/DfxYourCurrencyWalletSection',
  component: DfxYourCurrencyWalletSection,
} as ComponentMeta<typeof DfxYourCurrencyWalletSection>;

const dummyCurrencies: Fiat[] = [{ name: 'EUR' }, { name: 'USD' }];

const dummyAsset: Asset = {
  id: 1001,
  name: 'ETH',
  description: 'Ethereum',
  comingSoon: false,
};

export const Default: ComponentStory<typeof DfxYourCurrencyWalletSection> = () => {
  return (
    <div className="bg-white p-10 max-w-2xl">
      <DfxYourCurrencyWalletSection
        currencies={dummyCurrencies}
        currencyElementName="currency"
        asset={dummyAsset}
        assetProtocol="ERC-20"
        onAssetClick={() => console.log('clicked on asset')}
      />
    </div>
  );
};
Default.args = {};
