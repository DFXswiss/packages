import { forwardRef, useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { ControlProps } from './Form';

interface StyledDateAndTimePickerProps extends ControlProps {
  hideLabel?: boolean;
  smallLabel?: boolean;
}

interface StyledDateAndTimePickerContentProps extends StyledDateAndTimePickerProps {
  onChange: (date: Date) => void;
  value: Date | null;
}

const StyledDateAndTimePicker = forwardRef<HTMLDivElement, StyledDateAndTimePickerProps>(
  (props: StyledDateAndTimePickerProps, ref) => {
    return (
      <Controller
        control={props.control}
        render={({ field: { onChange, value } }) => <Content {...props} onChange={onChange} value={value} />}
        name={props.name}
        rules={props.rules}
      />
    );
  },
);

const Content = forwardRef<HTMLInputElement, StyledDateAndTimePickerContentProps>(
  (
    {
      control,
      name,
      label,
      rules,
      disabled,
      error,
      hideLabel,
      smallLabel,
      onChange,
      value,
      ...props
    }: StyledDateAndTimePickerContentProps,
    ref,
  ) => {
    const [selectedDateTime, setSelectedDateTime] = useState<string>('');

    useEffect(() => {
      const toLocalISOString = (date: Date) => {
        const tzoffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - tzoffset).toISOString().slice(0, -5);
      };

      if (value) {
        const localISOTime = toLocalISOString(value);
        setSelectedDateTime(localISOTime);
      } else {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        now.setMinutes(now.getMinutes() + 1);
        now.setSeconds(0);

        const defaultDateTime = toLocalISOString(now);
        setSelectedDateTime(defaultDateTime);
        onChange(now);
      }
    }, [value, onChange]);

    const handleDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const dateTime = event.target.value;
      setSelectedDateTime(dateTime);

      const newDate = new Date(dateTime);
      if (!isNaN(newDate.getTime())) {
        onChange(newDate);
      }
    };

    return (
      <>
        <style>
          {`
          input::-webkit-datetime-edit-day-field:focus,
          input::-webkit-datetime-edit-month-field:focus,
          input::-webkit-datetime-edit-year-field:focus {
              background-color: #f5516c; /* text-dfxRed-100 */
              color: white;
              outline: none;
          }

          input::-webkit-datetime-edit-hour-field:focus,
          input::-webkit-datetime-edit-minute-field:focus,
          input::-webkit-datetime-edit-second-field:focus {
              background-color: #f5516c;
              color: white;
              outline: none;
          }

          .custom-date-input,
          .custom-time-input {
            color: ${error ? '#f5516c' : '#2a4365'}; /* text-dfxRed-100 or text-dfxBlue-800 */
          }

          .custom-date-input::placeholder,
          .custom-time-input::placeholder {
            color: #a0aec0; /* text-dfxGray-600 */
          }
        `}
        </style>
        <div {...props} className="flex flex-col gap-4 w-full">
          <div className="flex flex-row gap-4">
            <div className="flex-1">
              {label && (
                <label
                  hidden={hideLabel}
                  className={`text-start ${smallLabel ? 'text-sm' : 'text-base'} font-semibold pl-3 text-dfxBlue-800`}
                >
                  {label}
                </label>
              )}
              <div className="h-1" />
              <input
                ref={ref}
                type="datetime-local"
                value={selectedDateTime}
                onChange={handleDateTimeChange}
                step="1"
                disabled={disabled}
                onKeyDown={(e) => e.preventDefault()}
                className={`custom-date-input text-base font-normal rounded-md p-4 w-full bg-white border border-dfxGray-500 focus:outline-dfxBlue-800 ${
                  disabled ? 'opacity-50 cursor-not-allowed focus:outline-none' : ''
                }`}
              />
            </div>
          </div>
        </div>
        {error && <p className="text-start text-sm text-dfxRed-100 pl-3">{error?.message}</p>}
      </>
    );
  },
);

export default StyledDateAndTimePicker;
