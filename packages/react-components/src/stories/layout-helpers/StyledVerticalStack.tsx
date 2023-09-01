import { PropsWithChildren } from 'react';
import { convertToRem } from './LayoutFunctions';

export interface StyledVerticalStackProps extends PropsWithChildren {
  gap?: number;
  marginY?: number;
  marginX?: number;
  center?: boolean;
  full?: boolean;
  className?: string;
}

export default function StyledVerticalStack({
  children,
  gap = 0,
  marginY,
  marginX,
  center,
  full,
  className = '',
}: StyledVerticalStackProps) {
  const spacing = convertToRem(gap);
  const mY = marginY != undefined ? convertToRem(marginY) : '0';
  const mX = marginX != undefined ? convertToRem(marginX) : '0';
  className += ' flex flex-col ';
  center && (className += 'items-center ');
  full && (className += 'w-full ');

  return (
    <div style={{ gap: spacing, margin: mY + ' ' + mX }} className={className}>
      {children}
    </div>
  );
}
