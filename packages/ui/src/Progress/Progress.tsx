import React from 'react';

export interface ProgressProps {
  value: number; // e.g. 3
  max: number; // e.g. 12
  showLabel?: boolean;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, max, showLabel = false, className = '' }) => {
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-500 font-medium mt-0.5">
          <span>{value} of {max} completed</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
};
