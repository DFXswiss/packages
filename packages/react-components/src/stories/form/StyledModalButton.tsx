import { Noop } from 'react-hook-form';
import StyledVerticalStack from '../layout-helpers/StyledVerticalStack';
import DfxIcon, { IconSize, IconVariant } from '../DfxIcon';

export interface StyledModalButtonProps<T> {
  label?: string;
  onClick: () => void;
  onBlur: Noop;
  value: T;
  descriptionFunc?: ((item: T) => string | undefined) | undefined;
  labelFunc: (item: T) => string;
  placeholder: string;
}

export default function StyledModalButton<T>({
  label,
  onClick,
  onBlur,
  value,
  descriptionFunc,
  labelFunc,
  placeholder,
  ...props
}: StyledModalButtonProps<T>): JSX.Element {
  return (
    <StyledVerticalStack gap={1} marginY={4}>
      <label className="text-dfxBlue-800 text-base font-semibold pl-4 text-start">{label}</label>
      <button
        className="flex justify-between border border-dfxGray-400 text-base font-normal rounded-md px-4 py-2 shadow-sm w-full"
        onClick={onClick}
        onBlur={onBlur}
        {...props}
      >
        <div className="flex flex-col justify-between text-left gap-1">
          {value ? (
            <>
              {descriptionFunc?.(value) && (
                <span className="text-dfxGray-800 text-xs h-min leading-none">{descriptionFunc(value)}</span>
              )}
              <span
                className={'text-dfxBlue-800 leading-none font-base'.concat(descriptionFunc?.(value) ? '' : ' py-2')}
              >
                {labelFunc(value)}
              </span>
            </>
          ) : (
            <span className="text-dfxGray-600 py-1">{placeholder}</span>
          )}
        </div>
        <div className="place-self-center">
          <DfxIcon icon={IconVariant.UNFOLD_MORE} size={IconSize.LG} />
        </div>
      </button>
    </StyledVerticalStack>
  );
}
