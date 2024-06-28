import { ComponentMeta, ComponentStory } from '@storybook/react';
import StyledDataTableExpandableRow from './StyledDataTableExpandableRow';
import { IconVariant } from './DfxIcon';

export default {
  title: 'Building Blocks/StyledDataTableExpandableRow',
  component: StyledDataTableExpandableRow,
} as ComponentMeta<typeof StyledDataTableExpandableRow>;

export const Default: ComponentStory<typeof StyledDataTableExpandableRow> = (args) => {
  return <StyledDataTableExpandableRow {...args}>Ethereum Mainnet</StyledDataTableExpandableRow>;
};
Default.args = {
  label: 'Connected to',
  expansionItems: [
    { label: 'Chain ID', text: '1245', icon: IconVariant.ARROW_RIGHT, onClick: () => console.log('Copied') },
    { label: 'Main Token', text: 'ETH' },
    { label: 'RPC URL', text: 'https://some-url.io', infoText: 'This is the RPC URL for the Ethereum Mainnet' },
  ],
};
