import { ComponentStory, ComponentMeta } from '@storybook/react';
import StyledBankAccountListItem from './StyledBankAccountListItem';

export default {
  title: 'Forms/StyledBankAccountListItem',
  component: StyledBankAccountListItem,
} as ComponentMeta<typeof StyledBankAccountListItem>;

export const SingleListItem: ComponentStory<typeof StyledBankAccountListItem> = (args) => (
  <div className="bg-white rounded p-8 max-w-lg">
    <StyledBankAccountListItem {...args} />
  </div>
);

SingleListItem.args = {
  bankAccount: { iban: 'BE68 5390 0754 7034', label: 'Credit Suisse' },
};

export const ThreeListItems: ComponentStory<typeof StyledBankAccountListItem> = () => (
  <div className="bg-white rounded p-8 max-w-lg">
    <StyledBankAccountListItem bankAccount={{ iban: 'BE68 5390 0754 7034', label: 'Credit Suisse' }} />
    <StyledBankAccountListItem bankAccount={{ iban: 'DE44 5920 0754 2344', label: 'Commerzbank' }} />

    <StyledBankAccountListItem bankAccount={{ iban: 'CH68 5390 2384 2349', label: 'GLS GemeinschaftsBank Bochum' }} />
  </div>
);
