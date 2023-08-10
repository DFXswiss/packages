import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Asset } from '../definitions/asset';
import { Fiat } from '../definitions/fiat';
import DfxYourCurrencyWalletSection from './DfxYourCurrencyWalletSection';
import { useForm } from 'react-hook-form';
import Form from './form/Form';

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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ currency: string }>();

  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <div className="bg-white p-10 max-w-2xl">
      <Form control={control} errors={errors} onSubmit={onSubmit}>
        <DfxYourCurrencyWalletSection
          name="currency"
          currencies={dummyCurrencies}
          currencyElementName="currency"
          asset={dummyAsset}
          assetProtocol="ERC-20"
          onAssetClick={() => console.log('clicked on asset')}
        />
      </Form>
    </div>
  );
};
Default.args = {};
