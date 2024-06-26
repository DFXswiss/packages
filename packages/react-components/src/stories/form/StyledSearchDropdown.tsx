import { RefObject, useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import StyledVerticalStack from '../layout-helpers/StyledVerticalStack';
import { ControlProps } from './Form';
import DfxIcon, { IconSize, IconVariant } from '../DfxIcon';
import { Utils } from '../../utils';
import DfxAssetIcon, { AssetIconVariant } from '../DfxAssetIcon';

interface StyledSearchDropdownProps<T> extends ControlProps {
  placeholder?: string;
  full?: boolean;
  smallLabel?: boolean;
  items: T[];
  labelFunc: (item: T) => string;
  balanceFunc?: (item: T) => string;
  descriptionFunc?: (item: T) => string;
  filterFunc: (item: T, search?: string) => boolean;
  matchFunc?: (item: T, search?: string) => boolean;
  priceFunc?: (item: T) => string;
  assetIconFunc?: (item: T) => AssetIconVariant;
  rootRef?: RefObject<HTMLElement>;
  forceEnable?: boolean;
  autocomplete?: string;
}

function StyledSearchDropdown<T>({
  control,
  name,
  label,
  rules,
  disabled = false,
  error,
  placeholder,
  full = false,
  smallLabel = false,
  items,
  labelFunc,
  balanceFunc,
  descriptionFunc,
  filterFunc,
  matchFunc,
  priceFunc,
  assetIconFunc,
  rootRef,
  forceEnable,
  autocomplete,
  ...props
}: StyledSearchDropdownProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState<string | undefined>();

  const visibleItems = items.filter((i) => filterFunc(i, search));

  const textColor = 'text-dfxBlue-800';
  const textOrErrorColor = error ? 'text-dfxRed-100' : textColor;

  let inputClasses = `text-base font-normal pl-4 pr-[2.5rem] py-2 w-full placeholder:text-dfxGray-600 border border-dfxGray-500 outline-2 outline-dfxBlue-400 ${textOrErrorColor}`;
  isOpen && visibleItems.length ? (inputClasses += ' rounded-x rounded-t') : (inputClasses += ' rounded');

  const isDisabled = disabled || (items.length <= 1 && !forceEnable);

  !isDisabled && (inputClasses += ' cursor-pointer');

  useEffect(() => {
    !isOpen && setSearch(undefined);
  }, [isOpen]);

  useEffect(() => {
    const element = rootRef?.current ?? document;
    if (element) {
      element.addEventListener('mousedown', closeDropdown);
      return () => element.removeEventListener('mousedown', closeDropdown);
    }
  }, [rootRef, isOpen]);

  function closeDropdown(e: Event) {
    if (
      isOpen &&
      Utils.isNode(e.target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      inputRef.current &&
      !inputRef.current.contains(e.target)
    ) {
      setIsOpen(false);
    }
  }

  return (
    <Controller
      control={control}
      render={({ field: { onChange, onBlur, value } }) => {
        const isFocused = inputRef.current === document.activeElement && isOpen;
        const largeInput = isFocused || !value;

        const backgroundColor = isDisabled || (isOpen && !isFocused) ? ' bg-dfxGray-400/50' : ' bg-white';
        inputClasses += backgroundColor;

        return (
          <div className={`relative ${full ? 'w-full' : ''}`}>
            <StyledVerticalStack gap={1} full={full}>
              {label && (
                <label
                  className={
                    `text-start ${smallLabel ? 'text-sm' : 'text-base'} font-semibold pl-3 pl- ` + [textColor].join(' ')
                  }
                >
                  {label}
                </label>
              )}
              <div className={`relative h-[58px] ${isDisabled ? '' : 'cursor-pointer'}`}>
                {!isDisabled && (
                  <div
                    className="absolute right-[17px] flex justify-center items-center h-full"
                    onClick={() => setIsOpen((o) => !o)}
                  >
                    <DfxIcon icon={isOpen ? IconVariant.EXPAND_LESS : IconVariant.EXPAND_MORE} size={IconSize.LG} />
                  </div>
                )}

                <div
                  className={`flex flex-row gap-2 items-center w-full h-full ${largeInput ? '' : inputClasses}`}
                  onClick={() => inputRef.current?.focus()}
                >
                  {!largeInput && assetIconFunc && (
                    <div>
                      <DfxAssetIcon asset={assetIconFunc(value)} />
                    </div>
                  )}
                  <div className="flex flex-row justify-between items-center w-full h-full">
                    <div className="flex-1 flex flex-col gap-1 justify-between text-left h-full">
                      <span className={`${textOrErrorColor} leading-none font-semibold flex justify-between h-full`}>
                        <input
                          ref={inputRef}
                          className={largeInput ? inputClasses : `w-full`}
                          style={{ backgroundColor: largeInput ? '' : 'transparent' }}
                          type="text"
                          name={autocomplete ?? name}
                          onFocus={() => setIsOpen(true)}
                          onBlur={onBlur}
                          onChange={(value) => {
                            const val = value.target.value;
                            setSearch(val);

                            const matches = items.filter((i) => matchFunc?.(i, val));
                            if (matches.length === 1) onChange(matches[0]);
                          }}
                          placeholder={placeholder}
                          value={search ?? (value ? labelFunc(value) : '')}
                          disabled={isDisabled}
                          {...props}
                        />
                      </span>
                      {!largeInput && descriptionFunc && (
                        <span className="text-dfxGray-800 text-xs h-min leading-none flex justify-between">
                          {descriptionFunc(value)}
                          {priceFunc && <p>{priceFunc(value)}</p>}
                        </span>
                      )}
                    </div>
                    {!largeInput && balanceFunc && <div className="font-semibold">{balanceFunc(value)}</div>}
                  </div>
                </div>
              </div>
            </StyledVerticalStack>

            {isOpen && visibleItems.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute bg-white rounded-b border-x border-b border-dfxGray-500 w-full z-10 overflow-y-auto max-h-[15rem]"
              >
                {visibleItems.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      onChange(item);
                      setIsOpen(false);
                    }}
                    className="flex flex-col gap-2 justify-between text-left w-full hover:bg-dfxGray-400/50 px-3.5 py-2.5"
                  >
                    <div className="flex flex-row gap-2 items-center w-full">
                      {assetIconFunc && (
                        <div>
                          <DfxAssetIcon asset={assetIconFunc(item)} />
                        </div>
                      )}
                      <div className="flex flex-row justify-between items-center w-full h-full text-dfxBlue-800">
                        <div className="flex flex-col gap-1 justify-between text-left w-full">
                          <span
                            className={`leading-none font-semibold flex justify-between ${
                              !descriptionFunc && !assetIconFunc ? 'py-[0.25rem]' : ''
                            }`}
                          >
                            {labelFunc(item)}
                          </span>
                          {descriptionFunc && (
                            <span className="text-dfxGray-800 text-xs h-min leading-none flex justify-between">
                              {descriptionFunc(item)}
                              {priceFunc && <p>{priceFunc(item)}</p>}
                            </span>
                          )}
                        </div>
                        {balanceFunc && <div className="font-semibold">{balanceFunc(item)}</div>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {error && <p className="text-start text-sm text-dfxRed-100 pl-3">{error?.message}</p>}
          </div>
        );
      }}
      name={name}
      rules={rules}
    />
  );
}

export default StyledSearchDropdown;
