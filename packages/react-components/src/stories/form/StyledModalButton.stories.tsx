import { ComponentMeta, ComponentStory } from '@storybook/react';
import StyledModalButton from './StyledModalButton';

export default {
  title: 'Forms/StyledModalButton',
  component: StyledModalButton,
} as ComponentMeta<typeof StyledModalButton>;

export const BankAccountSelection: ComponentStory<typeof StyledModalButton<{label: string, desc: string}>> = (args) => {
  args.onClick = () => undefined;
  args.onBlur = () => undefined;
  args.descriptionFunc = (i) => i.desc;
  args.labelFunc = (i) => i.label;

  return (
    <div className="bg-white p-10">
      <StyledModalButton {...args} />
    </div>
  )
}
BankAccountSelection.args = {
  label: 'Cash out to my bank account',
  value: {label: 'CH00 0000', desc: 'Test account'},
  placeholder: 'CH11 1111',
};