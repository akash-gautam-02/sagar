import React from 'react';
import { clsx } from 'clsx';

const Button = ({ 
  children, 
  variant = 'primary', 
  className, 
  ...props 
}) => {
  // RESPONSIVE: Full-width on mobile screens, auto-width on desktop
  // Added 'w-full sm:w-auto' to baseStyles
  const baseStyles = "w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-dm-sans font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer";
  
  const variants = {
    primary: "bg-brand-accent text-white hover:bg-brand-accent-hover hover:scale-105 shadow-lg",
    secondary: "border-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white hover:scale-105",
    ghost: "text-brand-accent hover:underline underline-offset-4 !px-0 !py-0 !w-auto", // Ghost variant remains inline
    white: "bg-white text-brand-black hover:scale-105 shadow-lg",
    outlineWhite: "border-2 border-white text-white hover:bg-white hover:text-brand-black"
  };

  return (
    <button 
      className={clsx(
        baseStyles, 
        variants[variant], 
        props.disabled && "opacity-50 cursor-not-allowed transform-none hover:scale-100", 
        className
      )} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

