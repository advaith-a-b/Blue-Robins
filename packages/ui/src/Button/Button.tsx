import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyle = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-[#354E80] text-white hover:bg-[#2d426d] active:scale-95 focus:ring-[#354E80]',
      secondary: 'bg-[#F59E0B] text-white hover:bg-[#d97706] active:scale-95 focus:ring-[#F59E0B]',
      outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 active:scale-95 focus:ring-gray-400',
      ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-95 focus:ring-gray-400',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-95 focus:ring-red-600',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
