import React from 'react';
import { clsx } from 'clsx';

const Card = ({ children, className }) => {
  return (
    <div className={clsx(
      "rounded-3xl p-6 sm:p-8 transition-all duration-300",
      "bg-white border border-gray-100 hover:border-brand-accent hover:shadow-xl hover:-translate-y-1",
      "dark:bg-[#1A1D23] dark:border-white/5 dark:hover:border-brand-accent/50 dark:hover:shadow-brand-accent/5",
      className
    )}>
      {children}
    </div>
  );
};

export default Card;
