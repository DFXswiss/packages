import { useState } from 'react';
import { Controller } from 'react-hook-form';
import StyledVerticalStack from '../layout-helpers/StyledVerticalStack';
import StyledModal, { StyledModalColor, StyledModalWidth } from '../StyledModal';
import { ControlProps } from './Form';
import StyledModalButton from './StyledModalButton';

interface StyledModalDropdownProps<T> extends ControlProps {
  placeholder: string;
  labelFunc: (item: T) => string;
  descriptionFunc?: (item: T) => string | undefined;
  modal: {
    heading: string;
    items: T[];
    width?: StyledModalWidth;
    itemContent: (item: T) => JSX.Element;
    form?: (onFormSubmit: (item: T) => void) => JSX.Element;
  };
}

export default function StyledModalDropdown<T>({
  control,
  name,
  label,
  rules,
  modal,
  labelFunc,
  descriptionFunc,
  ...props
}: StyledModalDropdownProps<T>): JSX.Element {
  const [showModal, setShowModal] = useState(false);
  return (
    <Controller
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <>
          <StyledModal
            isVisible={showModal}
            onClose={setShowModal}
            width={modal.width}
            heading={modal.heading}
            color={StyledModalColor.WHITE}
          >
            {modal.items.length > 0 && (
              <StyledVerticalStack gap={4}>
                {modal.items
                  .map((item) => ({ item, content: modal.itemContent(item) }))
                  .map((obj, index: number) => (
                    <button
                      key={index}
                      className="text-start"
                      onClick={() => {
                        onChange(obj.item);
                        setShowModal(false);
                      }}
                    >
                      {obj.content}
                    </button>
                  ))}
              </StyledVerticalStack>
            )}
            {modal.form && (
              <>
                <div
                  className={`h-[1px] bg-dfxGray-400 ${
                    modal.width === StyledModalWidth.NONE ? '-mx-4' : '-mx-14'
                  } my-6`}
                />
                {modal.form((item) => {
                  onChange(item);
                  setShowModal(false);
                })}
              </>
            )}
          </StyledModal>
          <StyledModalButton
            label={label}
            onClick={() => setShowModal(true)}
            onBlur={onBlur}
            value={value && labelFunc(value)}
            description={value && descriptionFunc?.(value)}
            {...props}
          />
        </>
      )}
      name={name}
      rules={rules}
    />
  );
}
