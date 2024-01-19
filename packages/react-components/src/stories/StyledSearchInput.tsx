import { forwardRef, useState } from 'react';
import DfxIcon, { IconColor, IconSize, IconVariant } from './DfxIcon';

export interface StyledSearchInputProps {
  placeholder: string;
  onChange: (search: string) => void;
  noClearButton?: boolean;
}

const StyledSearchInput = forwardRef<HTMLInputElement, StyledSearchInputProps>(
  ({ placeholder, onChange: emit, noClearButton }: StyledSearchInputProps, ref) => {
    const [value, setValue] = useState<string>('');

    function onChange(search: string) {
      setValue(search);
      emit(search);
    }

    return (
      <div className="relative w-full">
        <div className="absolute left-2 top-[9px]">
          <DfxIcon icon={IconVariant.SEARCH} color={IconColor.DARK_GRAY} size={IconSize.LG} />
        </div>

        {!noClearButton && (
          <div className="absolute right-2 top-[9px]">
            <button type="button" onClick={() => onChange('')}>
              <DfxIcon icon={IconVariant.CLOSE} color={IconColor.DARK_GRAY} size={IconSize.LG} />
            </button>
          </div>
        )}

        <input
          ref={ref}
          className={`text-base font-normal rounded-md pl-8 ${
            noClearButton ? 'pr-3' : 'pr-8'
          } py-2 w-full bg-white text-dfxBlue-800 placeholder:text-dfxGray-600 border border-dfxGray-400 outline-2 outline-dfxBlue-400`}
          placeholder={placeholder}
          value={value}
          onChange={(value) => onChange(value.target.value)}
        />
      </div>
    );
  },
);

export default StyledSearchInput;
