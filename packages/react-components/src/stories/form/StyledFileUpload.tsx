import { forwardRef } from 'react';
import { ControlProps } from './Form';
import { useDropzone } from 'react-dropzone';
import StyledVerticalStack from '../layout-helpers/StyledVerticalStack';
import { Controller } from 'react-hook-form';
import DfxIcon, { IconColor, IconVariant } from '../DfxIcon';
import StyledButton, { StyledButtonColor, StyledButtonSize, StyledButtonWidth } from '../StyledButton';

interface StyledFileUploadProps extends ControlProps {
  placeholder?: string;
  forceError?: boolean;
  forceErrorMessage?: string;
  hideLabel?: boolean;
  darkTheme?: boolean;
  full?: boolean;
  small?: boolean;
  smallLabel?: boolean;
  buttonLabel?: string;
}

interface StyledFileUploadContentProps extends StyledFileUploadProps {
  onChange: (event: any) => void;
  value: any;
}

const StyledFileUpload = forwardRef<HTMLInputElement, StyledFileUploadProps>((props: StyledFileUploadProps, ref) => {
  return (
    <Controller
      control={props.control}
      render={({ field: { onChange, value } }) => <Content {...props} onChange={onChange} value={value} />}
      name={props.name}
      rules={props.rules}
    />
  );
});

const Content = forwardRef<HTMLInputElement, StyledFileUploadContentProps>(
  (
    {
      control,
      name,
      label,
      rules,
      disabled = false,
      error,
      placeholder,
      forceError,
      forceErrorMessage,
      hideLabel,
      darkTheme,
      full,
      small,
      smallLabel,
      buttonLabel,
      onChange,
      value,
      ...props
    }: StyledFileUploadContentProps,
    ref,
  ) => {
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (acceptedFiles) => onChange(acceptedFiles[0]),
      multiple: false,
    });

    const textColor = darkTheme ? 'text-white' : 'text-dfxBlue-800';
    const backgroundColor = darkTheme ? 'bg-white bg-opacity-5' : 'bg-white';
    const placeholderColor = darkTheme ? 'text-dfxGray-800' : 'text-dfxGray-600';
    const borderColor = darkTheme ? 'border-none' : 'border border-dfxGray-500';
    const outlineColor = darkTheme ? 'outline-none' : 'outline-2 outline-dfxBlue-400';

    const textOrErrorColor = error || forceError ? 'text-dfxRed-100' : textColor;

    return (
      <StyledVerticalStack gap={1} full={full}>
        {label && (
          <label
            hidden={hideLabel}
            className={
              `text-start ${smallLabel ? 'text-sm' : 'text-base'} font-semibold pl-3 pl- ` + [textColor].join(' ')
            }
          >
            {label}
          </label>
        )}
        <div
          {...getRootProps()}
          {...props}
          className={
            `text-base font-normal rounded-md p-4 ${small ? 'w-24' : 'w-full'} ${
              value ? 'border-solid' : 'border-dashed'
            } ` + [textOrErrorColor, backgroundColor, borderColor, outlineColor].join(' ')
          }
        >
          <input ref={ref} {...getInputProps()} />
          <div className="flex flex-row gap-2 items-center">
            <DfxIcon icon={IconVariant.FILE_UPLOAD} color={darkTheme ? IconColor.WHITE : IconColor.BLUE} />
            <div className={value?.name ? undefined : placeholderColor}>{value?.name ?? placeholder}</div>
            {buttonLabel && (
              <StyledButton
                className="rounded-sm ml-auto mr-0"
                label={buttonLabel}
                size={StyledButtonSize.SMALL}
                width={StyledButtonWidth.MIN}
                color={darkTheme ? StyledButtonColor.WHITE : StyledButtonColor.STURDY_WHITE}
                caps={false}
                onClick={() => undefined}
              />
            )}
          </div>
        </div>
        {(forceErrorMessage || error) && (
          <p className="text-start text-sm text-dfxRed-100 pl-3">{forceErrorMessage ?? error?.message}</p>
        )}
      </StyledVerticalStack>
    );
  },
);

export default StyledFileUpload;
