import { PropsWithChildren, useContext } from 'react';
import { IconColor } from './DfxIcon';
import { AlignContent, ThemeContext } from './StyledDataTable';
import StyledInfoText, { StyledInfoTextSize } from './StyledInfoText';
import StyledLoadingSpinner, { SpinnerSize, SpinnerVariant } from './StyledLoadingSpinner';

interface StyledDataTableRowProps extends PropsWithChildren {
  label?: string;
  discreet?: boolean;
  isLoading?: boolean;
  infoText?: string;
  noPadding?: boolean;
}

const ALIGN_MAPS: Record<AlignContent, string> = {
  [AlignContent.LEFT]: ' justify-start',
  [AlignContent.RIGHT]: ' justify-end',
  [AlignContent.BETWEEN]: ' justify-between',
};

export default function StyledDataTableRow({
  label,
  children,
  discreet,
  isLoading,
  infoText,
  noPadding,
}: StyledDataTableRowProps) {
  const theme = useContext(ThemeContext);

  let wrapperClasses = 'flex flex-col gap-3 text-sm';
  let labelClasses = ' ';
  let rowDataClasses = 'flex gap-3 w-full';

  discreet && (wrapperClasses += ' opacity-70');

  theme.showBorder
    ? (wrapperClasses += ' px-3.5 py-2.5 border-t border-x last:border-y first:rounded-t last:rounded-b')
    : !noPadding && (wrapperClasses += ' py-2');

  !theme.showBorder && theme.narrow && (wrapperClasses += ' px-3.5');

  if (theme.darkTheme) {
    labelClasses += ' text-dfxGray-600';
    wrapperClasses += ' border-white/20';
  } else {
    labelClasses += ' text-dfxGray-800';
    rowDataClasses += ' text-dfxBlue-800';
    wrapperClasses += ' border-dfxGray-400';
  }

  rowDataClasses += ALIGN_MAPS[theme.alignContent];

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
            <StyledLoadingSpinner
              size={SpinnerSize.SM}
              variant={theme.darkTheme ? SpinnerVariant.DARK_MODE : SpinnerVariant.LIGHT_MODE}
            />
          ) : (
            children
          )}
        </div>
      </div>
      {infoText && (
        <div className="flex justify-start text-left">
          <StyledInfoText textSize={StyledInfoTextSize.XS} iconColor={IconColor.GRAY} discreet>
            {infoText}
          </StyledInfoText>
        </div>
      )}
    </div>
  );
}
