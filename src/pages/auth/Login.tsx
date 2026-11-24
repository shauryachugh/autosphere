import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Zap, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const Login: React.FC = () => {
  const { signIn, isSupabaseConnected, isLoading } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const { error } = await signIn(email.trim(), password);
    setSubmitting(false);

    if (error) {
      setErrorMsg(error.message || 'Invalid email or password. Please try again.');
      showToast(error.message || 'Sign in failed', 'error');
    } else {
      showToast('Welcome back to AutoSphere!', 'success');
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient automotive light cones */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-glow-blue flex items-center justify-center mb-3">
            <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan-400 fill-cyan-400/20" />
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Auto<span className="text-cyan-400">Sphere</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to access your vehicle intelligence platform
          </p>

          <div className="mt-2">
            <Badge variant={isSupabaseConnected ? 'success' : 'electric'} size="xs" dot>
              {isSupabaseConnected ? 'Supabase Auth & RLS Connected' : 'AutoSphere Cloud Ready'}
            </Badge>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={submitting || isLoading}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Sign In with Email
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 text-xs text-slate-400">
          Don't have an AutoSphere account?{' '}
          <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold underline">
            Register for Free
          </Link>
        </div>
      </div>
    </div>
  );
};
