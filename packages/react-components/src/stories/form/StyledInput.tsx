import { forwardRef, HTMLInputTypeAttribute } from 'react';
import { Controller } from 'react-hook-form';
import StyledVerticalStack from '../layout-helpers/StyledVerticalStack';
import { ControlProps } from './Form';
import StyledLoadingSpinner from '../StyledLoadingSpinner';

interface StyledInputProps extends ControlProps {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  prefix?: string;
  buttonLabel?: string;
  buttonClick?: () => void;
  forceError?: boolean;
  forceErrorMessage?: string;
  hideLabel?: boolean;
  darkTheme?: boolean;
  full?: boolean;
  loading?: boolean;
  small?: boolean;
  smallLabel?: boolean;
  autocomplete?: string;
}

function getMargin(affix?: string): number {
  return 12 + (affix?.length ?? 0) * 14;
}

const StyledInput = forwardRef<HTMLInputElement, StyledInputProps>(
  (
    {
      control,
      name,
      autocomplete,
      label,
      rules,
      disabled = false,
      error,
      type = 'text',
      placeholder,
      prefix,
      buttonLabel,
      buttonClick,
      forceError = false,
      forceErrorMessage,
      hideLabel = false,
      darkTheme = false,
      loading = false,
      full = false,
      small = false,
      smallLabel = false,
      ...props
    }: StyledInputProps,
    ref,
  ) => {
    const textColor = darkTheme ? 'text-white' : 'text-dfxBlue-800';
    const backgroundColor = darkTheme ? 'bg-white bg-opacity-5' : 'bg-white';
    const placeholderColor = darkTheme ? 'placeholder:text-dfxGray-800' : 'placeholder:text-dfxGray-600';
    const borderColor = darkTheme ? 'border-none' : 'border border-dfxGray-500';
    const outlineColor = darkTheme ? 'outline-none' : 'outline-2 outline-dfxBlue-400';
    const paddingLeft = getMargin(prefix);
    const paddingRight = getMargin(buttonLabel);

    const textOrErrorColor = error || forceError ? 'text-dfxRed-100' : textColor;

    return (
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
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
            <div className="relative">
              {prefix && (
                <div
                  className={`text-dfxGray-800 absolute ${
                    prefix.length > 0 ? 'left-3' : ''
                  } flex justify-center items-center h-[3.6rem]`}
                >
                  <p>{prefix}</p>
                </div>
              )}

              {loading && (
                <div className="absolute right-3 h-w-8 flex justify-center items-center h-[3.6rem]">
                  <StyledLoadingSpinner />
                </div>
              )}

              {buttonLabel && !loading && (
                <div
                  className={`text-dfxRed-100 absolute ${
                    buttonLabel.length > 0 ? 'right-3' : ''
                  } flex justify-center items-center h-[3.6rem]`}
                >
                  <button onClick={buttonClick}>{buttonLabel}</button>
                </div>
              )}

              <input
                className={
                  `text-base font-normal rounded-md p-4 ${small ? 'w-24' : 'w-full'} ` +
                  [textOrErrorColor, backgroundColor, placeholderColor, borderColor, outlineColor].join(' ')
                }
                style={{ paddingLeft, paddingRight }}
                type={type}
                name={autocomplete ?? name}
                inputMode={type === 'number' ? 'decimal' : undefined}
                onBlur={onBlur}
                onChange={(value) => onChange(value.target.value)}
                placeholder={placeholder}
                value={value ?? ''}
                disabled={disabled}
                ref={ref}
                onWheel={(e) => type === 'number' && e.currentTarget.blur()}
                {...props}
              />
            </div>
            {(forceErrorMessage || error) && (
              <p className="text-start text-sm text-dfxRed-100 pl-3">{forceErrorMessage ?? error?.message}</p>
            )}
          </StyledVerticalStack>
        )}
        name={name}
        rules={rules}
      />
    );
  },
);

export default StyledInput;
