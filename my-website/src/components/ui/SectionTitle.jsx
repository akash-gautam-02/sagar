import React from 'react';
import { clsx } from 'clsx';

const SectionTitle = ({ title, subtitle, centered = false, className }) => {
  return (
    <div className={clsx(
      // RESPONSIVE: Adjust vertical spacing
      "mb-10 md:mb-16",
      centered ? "text-center" : "text-left",
      className
    )}>
      {subtitle && (
        <p className="text-brand-accent font-dm-sans font-semibold mb-3 md:mb-4 uppercase tracking-widest text-xs md:text-sm">
          {subtitle}
        </p>
      )}
      {/* RESPONSIVE: Scaling heading from mobile to desktop sizes */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-syne font-bold text-gray-900 leading-tight">
        {title}
      </h2>
    </div>
  );
};

export default SectionTitle;

