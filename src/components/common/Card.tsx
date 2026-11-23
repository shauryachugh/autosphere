import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  header?: React.ReactNode;
  actions?: React.ReactNode;
  hoverEffect?: boolean;
  glow?: boolean;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  actions,
  hoverEffect = false,
  glow = false,
  className = '',
  padding = 'md',
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6',
  };

  return (
    <div
      className={`
        bg-dark-900/90 
        border border-slate-800/80 
        rounded-xl 
        shadow-card
        ${hoverEffect ? 'hover:border-slate-700 hover:bg-dark-850/90 transition-all duration-200' : ''}
        ${glow ? 'border-cyan-500/30 shadow-[0_0_20px_-3px_rgba(0,210,255,0.15)]' : ''}
        ${className}
      `}
      {...props}
    >
      {(header || actions) && (
        <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3 sm:px-5">
          {header && (
            <div className="text-sm font-semibold text-slate-200 tracking-wide flex items-center gap-2">
              {header}
            </div>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={paddingClasses[padding]}>{children}</div>
    </div>
  );
};
