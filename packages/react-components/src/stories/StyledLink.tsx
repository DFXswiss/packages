import { HTMLAttributeAnchorTarget } from 'react';

interface StyledLinkProps {
  label: string;
  url?: string;
  dark?: boolean;
  target?: HTMLAttributeAnchorTarget;
  small?: boolean;
}

export function StyledLink({ label, url, dark, target, small }: StyledLinkProps): JSX.Element {
  return (
    <a
      className={`${dark ? 'text-dfxGray-800' : 'text-link opacity-30'} ${small ? 'text-xs' : ''}`}
      target={target ?? '_blank'}
      href={url}
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
}
