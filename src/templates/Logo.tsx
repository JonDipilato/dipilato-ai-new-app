'use client';

import Image from 'next/image';

export const Logo = (props: {
  isTextHidden?: boolean;
}) => (
  <div className="flex items-center gap-2">
    <Image
      src="/apple-touch-icon.png"
      alt="Dipilato Automations Logo"
      width={40}
      height={40}
      priority
    />
    {!props.isTextHidden && (
      <span className="important text-xl font-bold">
        
      </span>
    )}
  </div>
);
