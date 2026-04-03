import React from 'react';
import { clsx } from 'clsx';

const Badge = ({ children, className }) => {
  return (
    <span className={clsx(
      "inline-flex items-center px-4 py-1.5 rounded-full text-xs font-dm-sans font-semibold tracking-wider uppercase bg-brand-accent-light text-brand-accent",
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;
