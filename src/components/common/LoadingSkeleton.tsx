import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'chart';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'text',
  count = 1,
}) => {
  const baseClasses = 'animate-pulse bg-slate-800/60 rounded';

  const variantMap = {
    text: 'h-4 w-full',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-40 w-full rounded-xl',
    chart: 'h-64 w-full rounded-xl',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${baseClasses} ${variantMap[variant]} ${className}`}
        />
      ))}
    </>
  );
};
