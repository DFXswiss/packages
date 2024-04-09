import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useForm } from 'react-hook-form';
import Form from './Form';
import StyledFileUpload from './StyledFileUpload';

export default {
  title: 'Forms/StyledFileUpload',
  component: StyledFileUpload,
} as ComponentMeta<typeof StyledFileUpload>;

export const DefaultInput: ComponentStory<typeof StyledFileUpload> = (args) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ test: string }>();

  const onSubmit = handleSubmit((data) => console.log(data));
  let whiteBG = 'p-10 max-w-xl';
  args.darkTheme ? (whiteBG += ' bg-none') : (whiteBG += ' bg-white');
  return (
    <div className={whiteBG}>
      <Form control={control} errors={errors} onSubmit={onSubmit}>
        <StyledFileUpload {...args} name="test" />
      </Form>
    </div>
  );
};
DefaultInput.args = {
  label: 'File upload',
  placeholder: 'Drop files here',
  forceError: false,
  hideLabel: false,
  darkTheme: false,
  buttonLabel: 'Browse',
};
