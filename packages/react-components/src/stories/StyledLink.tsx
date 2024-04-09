import { HTMLAttributeAnchorTarget } from 'react';

interface StyledLinkProps {
  label: string;
  url?: string;
  onClick?: () => void;
  dark?: boolean;
  target?: HTMLAttributeAnchorTarget;
  small?: boolean;
}

export function StyledLink({ label, url, onClick, dark, target, small }: StyledLinkProps): JSX.Element {
  function onLinkClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!url) e.preventDefault();
    onClick?.();
  }

  return (
    <a
      className={`${dark ? 'text-dfxGray-800' : 'text-link opacity-30'} ${small ? 'text-xs' : ''}`}
      target={target ?? '_blank'}
      href={url ?? '#'}
      rel="noopener noreferrer"
      onClick={onLinkClick}
    >
      {label}
    </a>
  );
}
