import { ComponentMeta, ComponentStory } from '@storybook/react';
import StyledTextBox from './StyledTextBox';

export default {
  title: 'Building Blocks/StyledTextBox',
  component: StyledTextBox,
} as ComponentMeta<typeof StyledTextBox>;

export const Default: ComponentStory<typeof StyledTextBox> = (args) => {
  return <StyledTextBox {...args} />;
};
Default.args = {
  text: 'Put some text here',
};
