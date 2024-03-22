import { PropsWithChildren, useEffect, useState } from 'react';
import StyledVerticalStack from './layout-helpers/StyledVerticalStack';
import DfxIcon, { IconSize, IconVariant } from './DfxIcon';

interface StyledCollapsibleProps extends PropsWithChildren {
  darkTheme?: boolean;
  full?: boolean;
  title?: string;
  titleContent?: React.ReactNode;
  label?: string;
  smallLabel?: boolean;
  isExpanded?: boolean;
}

const StyledCollapsible = ({
  darkTheme = false,
  full = false,
  title,
  titleContent,
  label,
  smallLabel,
  ...props
}: StyledCollapsibleProps) => {
  const textColor = darkTheme ? 'text-white' : 'text-dfxBlue-800';
  const backgroundColor = darkTheme ? 'bg-white bg-opacity-5' : 'bg-white';
  const placeholderColor = darkTheme ? 'placeholder:text-dfxGray-800' : 'placeholder:text-dfxGray-600';
  const borderColor = darkTheme ? 'border-none' : 'border border-dfxGray-500';
  const outlineColor = darkTheme ? 'outline-none' : 'outline-2 outline-dfxBlue-400';

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (props.isExpanded != null) {
      setIsExpanded(props.isExpanded);
    }
  }, [props.isExpanded]);

  return (
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

      <div
        className={
          `text-base font-normal rounded-md w-full ` +
          [textColor, backgroundColor, placeholderColor, borderColor, outlineColor].join(' ')
        }
      >
        <div
          className={`p-4 w-full cursor-pointer flex flex-row ${textColor} items-center gap-2`}
          onClick={() => setIsExpanded((e) => !e)}
        >
          <div className="flex-1">{title ?? titleContent}</div>
          <DfxIcon icon={isExpanded ? IconVariant.EXPAND_LESS : IconVariant.EXPAND_MORE} size={IconSize.LG} />
        </div>

        {isExpanded && (
          <div className="px-4 pb-4">
            <div className="border-b border-dfxGray-400 mb-4"></div>
            {props.children}
          </div>
        )}
      </div>
    </StyledVerticalStack>
  );
};
export default StyledCollapsible;
