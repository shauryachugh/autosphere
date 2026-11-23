import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-slate-800 rounded-2xl bg-dark-900/40 ${className}`}
    >
      <div className="p-4 rounded-2xl bg-dark-800/80 border border-slate-700/60 text-cyan-400 mb-4 shadow-glow-subtle">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
