import { PropsWithChildren, useContext, useEffect, useState } from 'react';
import DfxIcon, { IconColor, IconSize, IconVariant } from './DfxIcon';
import { AlignContent, ThemeContext } from './StyledDataTable';
import StyledInfoText, { StyledInfoTextSize } from './StyledInfoText';
import StyledLoadingSpinner, { SpinnerSize, SpinnerVariant } from './StyledLoadingSpinner';

interface ExpansionItem {
  label: string;
  text: string;
}

interface StyledDataTableExpandableRowProps extends PropsWithChildren {
  label?: string;
  discreet?: boolean;
  isLoading?: boolean;
  infoText?: string;
  noPadding?: boolean;
  isExpanded?: boolean;
  expansionItems: ExpansionItem[];
}

const ALIGN_MAPS: Record<AlignContent, string> = {
  [AlignContent.LEFT]: ' justify-start',
  [AlignContent.RIGHT]: ' justify-end',
  [AlignContent.BETWEEN]: ' justify-between',
};

export default function StyledDataTableExpandableRow({
  label,
  children,
  discreet,
  isLoading,
  infoText,
  noPadding,
  expansionItems,
  ...props
}: StyledDataTableExpandableRowProps) {
  const theme = useContext(ThemeContext);

  let wrapperClasses = 'flex flex-col text-sm';
  let labelClasses = ' ';
  let rowDataClasses = 'flex gap-3 w-full';
  let separatorClasses = 'border-b my-2.5';

  discreet && (wrapperClasses += ' opacity-70');

  theme.showBorder
    ? (wrapperClasses += ' px-3.5 py-2.5 border-t border-x last:border-y first:rounded-t last:rounded-b')
    : !noPadding && (wrapperClasses += ' py-2');

  !theme.showBorder && theme.narrow && (wrapperClasses += ' px-3.5');

  if (theme.darkTheme) {
    labelClasses += ' text-dfxGray-600';
    wrapperClasses += ' border-white/20';
    separatorClasses += ' border-white/20';
  } else {
    labelClasses += ' text-dfxGray-800';
    rowDataClasses += ' text-dfxBlue-800';
    wrapperClasses += ' border-dfxGray-400';
    separatorClasses += ' border-dfxGray-400';
  }

  rowDataClasses += ALIGN_MAPS[theme.alignContent];

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (props.isExpanded != null) {
      setIsExpanded(props.isExpanded);
    }
  }, [props.isExpanded]);

  return (
    <div className={wrapperClasses}>
      <div className="flex">
        {label && (
          <div className={`flex-none ${theme.minWidth ? 'w-48' : ''}`}>
            <p className={labelClasses}>{label}</p>
          </div>
        )}

        <div className={rowDataClasses}>
          {isLoading ? (
            <StyledLoadingSpinner size={SpinnerSize.SM} variant={SpinnerVariant.PALE} />
          ) : (
            <div
              className={`w-full cursor-pointer flex flex-row gap-2 ${ALIGN_MAPS[theme.alignContent]}`}
              onClick={() => setIsExpanded((e) => !e)}
            >
              {children}
              {expansionItems.length > 0 && (
                <DfxIcon icon={isExpanded ? IconVariant.EXPAND_LESS : IconVariant.EXPAND_MORE} size={IconSize.LG} />
              )}
            </div>
          )}
        </div>
      </div>
      {!isLoading && (
        <>
          {infoText && (
            <div className="mt-2">
              <StyledInfoText textSize={StyledInfoTextSize.XS} iconColor={IconColor.GRAY} discreet>
                {infoText}
              </StyledInfoText>
            </div>
          )}
          {expansionItems.length > 0 && isExpanded && (
            <div>
              <div className={separatorClasses} />

              {expansionItems.map(({ label, text }) => (
                <div key={label} className="flex">
                  <div className={`flex-none ${theme.minWidth ? 'w-48' : ''}`}>
                    <p className={labelClasses}>{label}</p>
                  </div>

                  <div className={rowDataClasses}>{text}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
