'use client';

import React from 'react';

type ClientButtonProps = {
  onClick: () => void;
  className: string;
  href: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
};

export const ClientButton: React.FC<ClientButtonProps> = ({
  onClick,
  className,
  href,
  target,
  rel,
  children,
}) => {
  return (
    <a onClick={onClick} className={className} href={href} target={target} rel={rel}>
      {children}
    </a>
  );
};
