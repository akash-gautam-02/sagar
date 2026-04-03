import React from 'react';
import { clsx } from 'clsx';

const Card = ({ children, className, dark = false }) => {
  return (
    <div className={clsx(
      // RESPONSIVE: Balanced padding for mobile (p-6) vs desktop (p-8)
      "rounded-2xl p-6 sm:p-8 transition-all duration-300",
      dark 
        ? "bg-[#14141C] border border-[#1E1E2E] hover:border-brand-accent/50" 
        : "bg-white border border-gray-100 hover:border-brand-accent hover:shadow-xl hover:-translate-y-1",
      className
    )}>
      {children}
    </div>
  );
};

export default Card;

