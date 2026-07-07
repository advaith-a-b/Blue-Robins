import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', error, label, icon, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-gray-600 tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`w-full rounded-xl border bg-white py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
              icon ? 'pl-11 pr-4' : 'px-4'
            } ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                : 'border-gray-200 focus:border-[#354E80] focus:ring-[#354E80]/10'
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
