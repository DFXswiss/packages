import { ComponentMeta, ComponentStory } from '@storybook/react';
import { StyledLink } from './StyledLink';

export default {
  title: 'Building Blocks/StyledLink',
  component: StyledLink,
} as ComponentMeta<typeof StyledLink>;

export const Default: ComponentStory<typeof StyledLink> = (args) => {
  return (
    <StyledLink {...args}>
      Please transfer the purchase amount using this information via your banking application. The purpose of payment is
      important!
    </StyledLink>
  );
};
Default.args = {
  label: 'This is a link',
  url: 'https://dfx.swiss',
};
