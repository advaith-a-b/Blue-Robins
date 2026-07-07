import React, { useState } from 'react';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
  const [error, setError] = useState(false);

  const getInitials = (userName: string) => {
    return userName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg font-semibold',
    xl: 'w-20 h-20 text-2xl font-bold',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-slate-100 text-[#354E80] font-medium overflow-hidden border border-slate-200 select-none shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {src && !error ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};
