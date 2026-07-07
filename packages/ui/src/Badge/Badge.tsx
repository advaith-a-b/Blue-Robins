import React from 'react';

export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className = '' }) => {
  const baseStyle = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none border tracking-wide uppercase shrink-0';

  const variants = {
    primary: 'bg-[#354E80]/10 border-[#354E80]/20 text-[#354E80]',
    secondary: 'bg-indigo-50 border-indigo-100 text-indigo-700',
    success: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    danger: 'bg-red-50 border-red-100 text-red-700',
    warning: 'bg-amber-50 border-amber-100 text-amber-700',
    info: 'bg-sky-50 border-sky-100 text-sky-700',
    neutral: 'bg-slate-50 border-slate-200 text-slate-600',
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
