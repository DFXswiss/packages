import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useForm } from 'react-hook-form';
import Form from './Form';
import StyledDateAndTimePicker from './StyledDateAndTimePicker';

export default {
  title: 'Forms/StyledDateAndTimePicker',
  component: StyledDateAndTimePicker,
} as ComponentMeta<typeof StyledDateAndTimePicker>;

export const DefaultInput: ComponentStory<typeof StyledDateAndTimePicker> = (args) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ test: string }>();

  const onSubmit = handleSubmit((data) => console.log(data));
  let whiteBG = 'p-10 max-w-xl';
  return (
    <div className={whiteBG}>
      <Form control={control} errors={errors} onSubmit={onSubmit}>
        <StyledDateAndTimePicker {...args} name="test" />
      </Form>
    </div>
  );
};
DefaultInput.args = {
  label: 'Date picker',
  hideLabel: false,
};
