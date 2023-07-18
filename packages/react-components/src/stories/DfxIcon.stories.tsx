import DfxIcon, { IconColor, IconSize, IconVariant } from './DfxIcon';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Building Blocks/DfxIcons',
  component: DfxIcon,
} as ComponentMeta<typeof DfxIcon>;

export const SingleIcon: ComponentStory<typeof DfxIcon> = (args) => {
  return <DfxIcon {...args} />;
};

SingleIcon.args = {
  icon: IconVariant.COPY,
  color: IconColor.RED,
};

export const ProcessDoneIcon: ComponentStory<typeof DfxIcon> = (args) => {
  return <DfxIcon {...args} />;
};

ProcessDoneIcon.args = {
  icon: IconVariant.PROCESS_DONE,
  size: IconSize.XL,
};

export const AllIcons: ComponentStory<typeof DfxIcon> = (args) => {
  return (
    <div className="grid gap-6 grid-cols-6">
      {Object.values(IconVariant).map((icon) => (
        <DfxIcon {...args} key={icon} icon={icon} />
      ))}
    </div>
  );
};

AllIcons.args = {};
