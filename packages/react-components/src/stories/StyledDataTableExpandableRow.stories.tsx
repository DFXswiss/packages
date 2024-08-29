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
  infoText: 'This is the Ethereum Mainnet',
  expansionItems: [
    { label: 'Chain ID', text: '1245', icon: IconVariant.ARROW_RIGHT, onClick: () => console.log('Copied') },
    { label: 'Main Token', text: 'ETH' },
    {
      label: 'RPC URL',
      text: 'https://some-url.io',
      infoText: 'This is the RPC URL for the Ethereum Mainnet. \nThis is a second line.',
    },
  ],
  expansionContent: (
    <div className="flex w-full justify-center items-center p-2">
      <img src="https://via.placeholder.com/150" alt="placeholder" className="w-24 h-24" />
    </div>
  ),
};
