import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean; // positive in savings or increase
    isNeutral?: boolean;
    period?: string;
  };
  accentColor?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'indigo';
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'cyan',
  onClick,
  className = '',
}) => {
  const accentBorders = {
    cyan: 'hover:border-cyan-500/40 hover:shadow-[0_0_16px_rgba(0,210,255,0.1)]',
    emerald: 'hover:border-emerald-500/40 hover:shadow-[0_0_16px_rgba(16,185,129,0.1)]',
    amber: 'hover:border-amber-500/40 hover:shadow-[0_0_16px_rgba(245,158,11,0.1)]',
    rose: 'hover:border-rose-500/40 hover:shadow-[0_0_16px_rgba(239,68,68,0.1)]',
    indigo: 'hover:border-indigo-500/40 hover:shadow-[0_0_16px_rgba(99,102,241,0.1)]',
  };

  const iconColors = {
    cyan: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/40',
    emerald: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40',
    amber: 'text-amber-400 bg-amber-950/60 border-amber-800/40',
    rose: 'text-rose-400 bg-rose-950/60 border-rose-800/40',
    indigo: 'text-indigo-400 bg-indigo-950/60 border-indigo-800/40',
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-dark-900/90 
        border border-slate-800/80 
        rounded-xl 
        p-4 sm:p-5 
        transition-all 
        duration-200 
        ${onClick ? 'cursor-pointer' : ''}
        ${accentBorders[accentColor]}
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className={`p-2 rounded-lg border text-sm ${iconColors[accentColor]}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          {value}
        </span>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-xs">
        {subtitle && <span className="text-slate-400">{subtitle}</span>}
        
        {trend && (
          <div className="flex items-center gap-1 font-medium ml-auto">
            {trend.isNeutral ? (
              <Minus className="w-3.5 h-3.5 text-slate-400" />
            ) : trend.isPositive ? (
              <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span
              className={
                trend.isNeutral
                  ? 'text-slate-400'
                  : trend.isPositive
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }
            >
              {trend.value}
            </span>
            {trend.period && <span className="text-slate-500 font-normal">{trend.period}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
