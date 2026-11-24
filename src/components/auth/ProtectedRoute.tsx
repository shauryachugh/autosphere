import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Zap } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-glow-blue flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
            <Zap className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-white tracking-wide">
            Auto<span className="text-cyan-400">Sphere</span> Secure Handshake
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Verifying cryptographic telematics session credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
