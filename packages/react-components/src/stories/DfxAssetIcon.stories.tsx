import DfxAssetIcon, { AssetIconSize, AssetIconVariant } from './DfxAssetIcon';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Building Blocks/DfxAssetIcons',
  component: DfxAssetIcon,
} as ComponentMeta<typeof DfxAssetIcon>;

export const SingleIcon: ComponentStory<typeof DfxAssetIcon> = (args) => {
  return <DfxAssetIcon {...args} />;
};

export const AllIcons: ComponentStory<typeof DfxAssetIcon> = (args) => {
  return (
    <div className="grid gap-6 grid-cols-6">
      {Object.values(AssetIconVariant).map((icon) => (
        <DfxAssetIcon {...args} key={icon} asset={icon} />
      ))}
    </div>
  );
};

SingleIcon.args = {
  size: AssetIconSize.LG,
  asset: AssetIconVariant.USDT,
};
