import React from 'react';

interface NumberPlateProps {
  registrationNumber: string;
  size?: 'sm' | 'md' | 'lg';
  isEV?: boolean;
  className?: string;
}

export const NumberPlate: React.FC<NumberPlateProps> = ({
  registrationNumber,
  size = 'md',
  isEV = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] h-6 px-1.5',
    md: 'text-xs h-7 px-2',
    lg: 'text-sm h-8 px-2.5',
  };

  // Indian green background for electric vehicles, white/yellow for commercial/private
  const bgClasses = isEV
    ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
    : 'bg-slate-100 border-slate-300 text-slate-900';

  return (
    <div
      className={`inline-flex items-center rounded border shadow-sm font-mono tracking-widest font-bold select-none ${bgClasses} ${sizeClasses[size]} ${className}`}
      title={`High Security Registration Plate: ${registrationNumber}`}
    >
      {/* Left IND Blue Strip */}
      <div className="flex flex-col items-center justify-center pr-1.5 mr-1.5 border-r border-slate-400/40 text-[9px] font-sans leading-none text-blue-700 font-extrabold">
        <span className="text-[7px] leading-tight">🇮🇳</span>
        <span className="scale-75 tracking-tighter">IND</span>
      </div>

      {/* Reg Number */}
      <span className="uppercase">{registrationNumber}</span>
    </div>
  );
};
