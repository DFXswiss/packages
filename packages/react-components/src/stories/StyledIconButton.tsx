import DfxIcon, { IconVariant, IconColor, IconSize } from './DfxIcon';
import StyledLoadingSpinner, { SpinnerSize, SpinnerVariant } from './StyledLoadingSpinner';

const SizeMap = {
  [IconSize.XS]: SpinnerSize.SM,
  [IconSize.SM]: SpinnerSize.MD,
  [IconSize.MD]: SpinnerSize.MD,
  [IconSize.LG]: SpinnerSize.MD,
  [IconSize.XL]: SpinnerSize.LG,
  [IconSize.XXL]: SpinnerSize.LG,
};

export interface StyledIconButtonProps {
  onClick: () => void;
  size?: IconSize;
  icon: IconVariant;
  color?: IconColor;
  inline?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function StyledIconButton({
  onClick,
  size = IconSize.MD,
  icon,
  inline = false,
  color = IconColor.RED,
  isLoading = false,
  disabled,
}: StyledIconButtonProps) {
  const isDisabled = isLoading || disabled;

  let buttonClass = 'inline-block flex h-full align-top hover:scale-110 transition ease-in-out delay-100';
  buttonClass += inline ? ' px-2 pt-0.5' : '';
  return (
    <button type="button" className={buttonClass} onClick={onClick} disabled={isDisabled}>
      {isLoading ? (
        <>
          <StyledLoadingSpinner variant={SpinnerVariant.LIGHT_MODE} size={SizeMap[size]} />
        </>
      ) : (
        <DfxIcon icon={icon} color={color} size={size} />
      )}
    </button>
  );
}
