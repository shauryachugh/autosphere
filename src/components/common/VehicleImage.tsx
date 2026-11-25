import React, { useEffect, useState } from 'react';
import { Car } from 'lucide-react';
import { BodyType, FuelType } from '../../types';
import {
  getImageLoadStatus,
  resolveVehicleImage,
  setImageLoadStatus,
} from '../../services/vehicleImageService';

interface VehicleImageProps {
  make?: string;
  model?: string;
  image?: string | null;
  fuelType?: FuelType;
  bodyType?: BodyType;
  alt?: string;
  className?: string;
  imgClassName?: string;
  showSourceBadge?: boolean;
}

export const VehicleImage: React.FC<VehicleImageProps> = ({
  make,
  model,
  image,
  fuelType,
  bodyType,
  alt,
  className = 'w-full aspect-video rounded-xl',
  imgClassName = 'w-full h-full object-cover',
  showSourceBadge = false,
}) => {
  const resolved = resolveVehicleImage({ make, model, image, fuelType });
  const targetUrl = resolved.url;

  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(() => {
    if (!targetUrl) return 'error';
    return getImageLoadStatus(targetUrl) || 'loading';
  });

  useEffect(() => {
    if (!targetUrl) {
      setStatus('error');
      return;
    }
    const cached = getImageLoadStatus(targetUrl);
    if (cached === 'loaded' || cached === 'error') {
      setStatus(cached);
    } else {
      setStatus('loading');
      setImageLoadStatus(targetUrl, 'loading');
    }
  }, [targetUrl]);

  const handleLoad = () => {
    if (targetUrl) setImageLoadStatus(targetUrl, 'loaded');
    setStatus('loaded');
  };

  const handleError = () => {
    if (targetUrl) setImageLoadStatus(targetUrl, 'error');
    setStatus('error');
  };

  const displayName = [make, model].filter(Boolean).join(' ') || 'Vehicle';

  return (
    <div
      className={`relative overflow-hidden bg-dark-850 border border-slate-700/80 ${className}`}
    >
      {/* Loading skeleton */}
      {targetUrl && status === 'loading' && (
        <div className="absolute inset-0 bg-dark-800 animate-pulse flex items-center justify-center">
          <Car className="w-6 h-6 text-slate-600" />
        </div>
      )}

      {/* Actual photograph */}
      {targetUrl && status !== 'error' ? (
        <img
          src={targetUrl}
          alt={alt || displayName}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`${imgClassName} transition-opacity duration-300 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        /* Clean model-specific placeholder fallback */
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-dark-900 via-dark-850 to-slate-900">
          <Car className="w-7 h-7 text-cyan-400/70 mb-1" />
          <span className="text-[11px] font-bold text-slate-200 leading-tight line-clamp-1">
            {displayName}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">
            {bodyType ? `${bodyType} • ` : ''}Model Placeholder
          </span>
        </div>
      )}

      {showSourceBadge && (
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-dark-950/80 backdrop-blur-sm border border-slate-700/80 text-[10px] font-medium text-slate-300">
          {status === 'error' || !targetUrl ? 'Model Placeholder' : resolved.sourceLabel}
        </span>
      )}
    </div>
  );
};
