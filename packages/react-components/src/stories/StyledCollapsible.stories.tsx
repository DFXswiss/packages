import { ComponentMeta, ComponentStory } from '@storybook/react';
import StyledCollapsible from './StyledCollapsible';
import StyledDataTable from './StyledDataTable';
import StyledDataTableRow from './StyledDataTableRow';
import StyledHorizontalStack from './layout-helpers/StyledHorizontalStack';
import DfxAssetIcon, { AssetIconVariant } from './DfxAssetIcon';
import StyledVerticalStack from './layout-helpers/StyledVerticalStack';

export default {
  title: 'Building Blocks/StyledCollapsible',
  component: StyledCollapsible,
} as ComponentMeta<typeof StyledCollapsible>;

export const WithTitle: ComponentStory<typeof StyledCollapsible> = (args) => {
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
WithTitle.args = {
  title: 'Click me!',
};

export const WithTitleContent: ComponentStory<typeof StyledCollapsible> = (args) => {
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
WithTitleContent.args = {
  titleContent: (
    <StyledVerticalStack gap={1}>
      <StyledHorizontalStack gap={2}>
        <DfxAssetIcon asset={AssetIconVariant.BTC} />
        <p>Show me the Bitcoins!</p>
      </StyledHorizontalStack>
      Status: Pending
    </StyledVerticalStack>
  ),
};
