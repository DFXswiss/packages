import { ComponentMeta, ComponentStory } from '@storybook/react';
import StyledSearchInput from './StyledSearchInput';
import { useState } from 'react';

export default {
  title: 'Building Blocks/StyledSearchInput',
  component: StyledSearchInput,
} as ComponentMeta<typeof StyledSearchInput>;

export const Default: ComponentStory<typeof StyledSearchInput> = (args) => {
  const [search, setSearch] = useState<string>();
  return (
    <div className="p-10 max-w-xl bg-white">
      <StyledSearchInput {...args} onChange={setSearch} />
      {search && <p className="text-dfxGray-700">Search value: {search}</p>}
    </div>
  );
};
Default.args = {
  placeholder: 'Search...',
};
