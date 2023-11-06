import { ComponentMeta, ComponentStory } from '@storybook/react';
import StyledCollapsible from './StyledCollapsible';
import StyledDataTable from './StyledDataTable';
import StyledDataTableRow from './StyledDataTableRow';

export default {
  title: 'Building Blocks/StyledCollapsible',
  component: StyledCollapsible,
} as ComponentMeta<typeof StyledCollapsible>;

export const Default: ComponentStory<typeof StyledCollapsible> = (args) => {
  return (
    <StyledCollapsible {...args}>
      <StyledDataTable showBorder={false} darkTheme={args.darkTheme}>
        <StyledDataTableRow noPadding label="E-mail address">
          LU11 6060 0020 0000 5040
        </StyledDataTableRow>
        <StyledDataTableRow noPadding label="KYC status">
          OLKILUL1
        </StyledDataTableRow>
        <StyledDataTableRow noPadding label="Transaction limit">
          OC11-A025-BCF7
        </StyledDataTableRow>
      </StyledDataTable>
    </StyledCollapsible>
  );
};
Default.args = {
  title: 'Click me!',
};
