import { HTMLAttributeAnchorTarget } from 'react';

interface StyledLinkProps {
  label: string;
  url?: string;
  dark?: boolean;
  target?: HTMLAttributeAnchorTarget;
}

export function StyledLink({ label, url, dark, target }: StyledLinkProps): JSX.Element {
  return (
    <a
      className={`${dark ? 'text-dfxGray-800' : 'text-link opacity-30'}`}
      target={target ?? '_blank'}
      href={url}
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
}
