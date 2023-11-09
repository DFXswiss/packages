import { ComponentMeta, ComponentStory } from '@storybook/react';
import StyledModalButton from './StyledModalButton';

export default {
  title: 'Forms/StyledModalButton',
  component: StyledModalButton,
} as ComponentMeta<typeof StyledModalButton>;

export const BankAccountSelection: ComponentStory<typeof StyledModalButton> = (args) => {
  args.onClick = () => undefined;
  args.onBlur = () => undefined;

  return (
    <div className="bg-white p-10">
      <StyledModalButton {...args} />
    </div>
  );
};
BankAccountSelection.args = {
  label: 'Cash out to my bank account',
  value: 'CH00 0000',
  description: 'Test account',
  placeholder: 'CH11 1111',
};
