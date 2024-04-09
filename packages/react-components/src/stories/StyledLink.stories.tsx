import { ComponentMeta, ComponentStory } from '@storybook/react';
import { StyledLink } from './StyledLink';

export default {
  title: 'Building Blocks/StyledLink',
  component: StyledLink,
} as ComponentMeta<typeof StyledLink>;

export const LinkWithUrl: ComponentStory<typeof StyledLink> = (args) => {
  return <StyledLink {...args} />;
};
LinkWithUrl.args = {
  label: 'This is a link',
  url: 'https://dfx.swiss',
};

export const LinkWithCallback: ComponentStory<typeof StyledLink> = (args) => {
  return <StyledLink {...args} />;
};
LinkWithCallback.args = {
  label: 'This is a link',
  onClick: () => alert('Clicked'),
};
