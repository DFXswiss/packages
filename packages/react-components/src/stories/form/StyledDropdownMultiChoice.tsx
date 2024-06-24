import { ControlProps } from './Form';
import { RefObject, useEffect, useRef, useState } from 'react';
import DfxIcon, { IconColor, IconSize, IconVariant } from '../DfxIcon';
import { Controller } from 'react-hook-form';
import DfxAssetIcon, { AssetIconVariant } from '../DfxAssetIcon';
import { Utils } from '../../utils';

export interface StyledDropdownMultiChoiceProps<T> extends ControlProps {
  labelIcon?: IconVariant;
  placeholder?: string;
  full?: boolean;
  smallLabel?: boolean;
  items: T[];
  labelFunc: (item: T) => string;
  balanceFunc?: (item: T) => string;
  descriptionFunc?: (item: T) => string;
  priceFunc?: (item: T) => string;
  assetIconFunc?: (item: T) => AssetIconVariant;
  rootRef?: RefObject<HTMLElement>;
  forceEnable?: boolean;
  hideBalanceWhenClosed?: boolean;
}

interface IndexedItem<T> {
  item: T;
  index: number;
}

export default function StyledDropdownMultiChoice<T>({
  label,
  labelIcon,
  control,
  name,
  rules,
  disabled,
  items,
  placeholder,
  full,
  smallLabel,
  labelFunc,
  balanceFunc,
  descriptionFunc,
  priceFunc,
  assetIconFunc,
  rootRef,
  forceEnable,
  hideBalanceWhenClosed,
  error,
  ...props
}: StyledDropdownMultiChoiceProps<T>) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  let buttonClasses = 'flex justify-between border border-dfxGray-500 px-4 py-2 shadow-sm w-full h-[58px]';

  isOpen ? (buttonClasses += ' rounded-x rounded-t bg-dfxGray-400/50') : (buttonClasses += ' rounded');

  const isDisabled = disabled || (items.length <= 1 && !forceEnable);

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
      buttonRef.current &&
      !buttonRef.current.contains(e.target)
    ) {
      setIsOpen(false);
    }
  }

  return (
    <Controller
      control={control}
      render={({ field: { onChange, onBlur, value } }) => {
        const selectedItems = value || ([] as IndexedItem<T>[]);

        const toggleSelection = (indexedItem: IndexedItem<T>) => {
          const isSelected = selectedItems.some((selected: IndexedItem<T>) => selected.index === indexedItem.index);
          const newValue = isSelected
            ? selectedItems.filter((selected: IndexedItem<T>) => selected.index !== indexedItem.index)
            : [...selectedItems, indexedItem];
          onChange(newValue);
        };

        return (
          <div className={`relative ${full ? 'w-full' : ''}`}>
            {label && (
              <div className="flex items-center ml-3.5 mb-2.5">
                {labelIcon !== undefined && <DfxIcon icon={labelIcon} size={IconSize.SM} color={IconColor.BLUE} />}

                <label
                  className={`text-dfxBlue-800 ${smallLabel ? 'text-sm' : 'text-base'} font-semibold ${
                    labelIcon ? 'pl-3.5' : ''
                  }`}
                >
                  {label}
                </label>
              </div>
            )}
            <button
              ref={buttonRef}
              id="dropDownButton"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={buttonClasses}
              onBlur={onBlur}
              disabled={isDisabled}
              {...props}
            >
              <div className="flex flex-row gap-2 items-center w-full h-full">
                {selectedItems.length > 0 && assetIconFunc && (
                  <DfxAssetIcon asset={assetIconFunc(selectedItems[0].item)} />
                )}
                <div className="flex flex-col gap-1 justify-between text-left w-full">
                  {selectedItems.length === 0 ? (
                    <p className="text-dfxGray-600 drop-shadow-none py-[0.25rem]">{placeholder}</p>
                  ) : (
                    <>
                      <span
                        className={`${
                          error ? 'text-dfxRed-100' : 'text-dfxBlue-800'
                        } leading-none font-semibold flex justify-between ${
                          !descriptionFunc && !assetIconFunc ? 'py-[0.25rem]' : ''
                        }`}
                      >
                        {selectedItems.map(({ item }: IndexedItem<T>) => labelFunc(item)).join(', ')}
                      </span>
                    </>
                  )}
                </div>

                {!isDisabled && (
                  <div className="place-self-center">
                    <DfxIcon icon={isOpen ? IconVariant.EXPAND_LESS : IconVariant.EXPAND_MORE} size={IconSize.LG} />
                  </div>
                )}
              </div>
            </button>

            {isOpen && (
              <div
                ref={dropdownRef}
                className="absolute bg-white rounded-b border-x border-b border-dfxGray-500 w-full z-10 overflow-y-auto max-h-[15rem]"
              >
                {items.map((item, index) => {
                  const indexedItem: IndexedItem<T> = { item, index };
                  const isSelected = selectedItems.some((selected: IndexedItem<T>) => selected.index === index);

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => toggleSelection(indexedItem)}
                      className={`flex flex-col gap-2 justify-between text-left w-full px-3.5 py-2.5 ${
                        isSelected ? 'bg-dfxGray-400/50' : 'hover:bg-dfxGray-400/50'
                      }`}
                    >
                      <div className="flex flex-row gap-2 items-center w-full">
                        {assetIconFunc && <DfxAssetIcon asset={assetIconFunc(item)} />}
                        <div className="flex flex-col gap-1 justify-between text-left w-full">
                          <span
                            className={`text-dfxBlue-800 leading-none font-semibold flex justify-between ${
                              !descriptionFunc && !assetIconFunc ? 'py-[0.25rem]' : ''
                            }`}
                          >
                            {labelFunc(item)}
                            {balanceFunc && <p>{balanceFunc(item)}</p>}
                          </span>
                          {descriptionFunc && (
                            <span className="text-dfxGray-800 text-xs h-min leading-none flex justify-between">
                              {descriptionFunc(item)}
                              {priceFunc && <p>{priceFunc(item)}</p>}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
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
