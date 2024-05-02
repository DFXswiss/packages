import { PropsWithChildren } from 'react';
import DfxIcon, { IconColor, IconSize, IconVariant } from './DfxIcon';

interface StyledTabProps extends PropsWithChildren {
  setActive: () => any;
  active: boolean;
  deactivated?: boolean;
  icon?: IconVariant;
  flagWord1?: string;
  flagWord2?: string;
  darkTheme?: boolean;
  spread?: boolean;
  small?: boolean;
}

export default function StyledTab({
  children,
  active,
  setActive,
  deactivated = false,
  icon,
  flagWord1,
  flagWord2,
  darkTheme,
  spread,
  small,
}: StyledTabProps) {
  let tabClasses = 'font-black rounded-t-lg block flex items-center gap-2 w-full h-full ';
  tabClasses += small ? 'px-4 py-2 ' : 'text-2xl px-12 py-2 ';
  if (!deactivated) {
    if (active) {
      tabClasses += darkTheme ? 'bg-dfxGray-500' : 'bg-white';
    } else {
      tabClasses += darkTheme
        ? 'hover:bg-dfxGray-500/30 focus:bg-dfxGray-500/30'
        : 'hover:bg-white/10 focus:bg-white/10';
    }
  } else {
    tabClasses += 'cursor-default text-dfxBlue-800/70';
  }

  spread && (tabClasses += ' justify-center');

  return (
    <li className={`flex-${spread ? '1' : 'none'} text-center`}>
      <a
        className={tabClasses}
        onClick={(e) => {
          e.preventDefault();
          if (!deactivated) {
            setActive();
          }
        }}
        data-toggle="tab"
        href="#"
        role="tablist"
      >
        {children}

        {icon !== undefined && <IconFlag icon={icon} />}

        {flagWord1 !== undefined && <TwoWordFlag word1={flagWord1} word2={flagWord2} />}
      </a>
    </li>
  );
}

type TwoWordFlagProps = {
  word1: string | undefined;
  word2?: string;
};

function TwoWordFlag({ word1, word2 }: TwoWordFlagProps) {
  let flagClasses = 'text-2xs uppercase font-normal text-left leading-tight ';

  if (word2 !== undefined) {
    flagClasses += ' place-self-center';
  } else {
    flagClasses += ' place-self-start mt-2';
  }

  return (
    <div className={flagClasses}>
      {word1}
      {word2 !== undefined ? <br /> : null}
      {word2}
    </div>
  );
}

type IconFlagProps = {
  icon: IconVariant;
};

function IconFlag({ icon }: IconFlagProps) {
  return (
    <div className="place-self-center ml-1">
      <DfxIcon icon={icon} color={IconColor.BLUE} size={IconSize.LG} />
    </div>
  );
}
