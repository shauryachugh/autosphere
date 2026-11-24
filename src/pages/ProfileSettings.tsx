import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  User, 
  Bell, 
  Radio, 
  ShieldCheck, 
  CreditCard, 
  Download, 
  Save, 
  Smartphone, 
  MapPin, 
  Zap, 
  IndianRupee,
  LogOut,
  KeyRound
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatINR } from '../utils/formatters';

export const ProfileSettings: React.FC = () => {
  const { userProfile, updateUserProfile, activeVehicle, updateVehicle, showToast } = useApp();
  const { user, profile, signOut, isGuest, isSupabaseConnected } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(profile?.full_name || user?.user_metadata?.full_name || userProfile.name);
  const [email, setEmail] = useState(user?.email || userProfile.email);
  const [phone, setPhone] = useState(profile?.phone || user?.user_metadata?.phone || userProfile.phone);
  const [city, setCity] = useState(profile?.city || userProfile.city);
  const [state, setState] = useState(profile?.state || userProfile.state);
  const [alerts, setAlerts] = useState(userProfile.alerts);
  const [fastagRechargeAmount, setFastagRechargeAmount] = useState('1000');
  const [connectedSync, setConnectedSync] = useState(userProfile.connectedCarSyncEnabled);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      city,
      state,
      alerts,
      connectedCarSyncEnabled: connectedSync,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    showToast('Signed out of AutoSphere', 'info');
    navigate('/login', { replace: true });
  };

  const handleFastagRecharge = () => {
    if (!activeVehicle) {
      showToast('No active vehicle selected for FASTag recharge.', 'error');
      return;
    }
    const recharge = parseInt(fastagRechargeAmount, 10);
    if (isNaN(recharge) || recharge <= 0) {
      showToast('Please enter a valid FASTag recharge amount.', 'error');
      return;
    }
    updateVehicle(activeVehicle.id, {
      fastagBalanceINR: (activeVehicle.fastagBalanceINR || 0) + recharge,
    });
    showToast(`FASTag Wallet recharged with ₹${recharge.toLocaleString('en-IN')} via UPI.`, 'success');
  };

  const handleToggleAlert = (key: keyof typeof alerts) => {
    setAlerts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Profile & Telematics Settings
          </h1>
          <Badge variant="electric" size="sm">
            Account Preferences
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your personal driver profile, FASTag wallet, telematics sync and notification triggers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Details & FASTag Wallet (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* User Profile Card */}
          <Card
            header={
              <span className="flex items-center gap-2 text-sm font-bold text-white">
                <User className="w-4 h-4 text-cyan-400" />
                Driver & Account Profile
              </span>
            }
          >
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Phone (WhatsApp Alerts)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    City / RTO Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" size="sm" icon={<Save className="w-4 h-4" />}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* FASTag Wallet Management Card */}
          <Card
            header={
              <span className="flex items-center gap-2 text-sm font-bold text-white">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                NHAI NETC FASTag Wallet Manager
              </span>
            }
          >
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Linked FASTag ({activeVehicle?.regNumber || 'No Active Vehicle'})</span>
                  <div className="text-2xl font-bold text-white font-mono mt-1">
                    {formatINR(activeVehicle?.fastagBalanceINR ?? 0)}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    Auto-Replenish Active via IDFC FIRST Bank
                  </span>
                </div>

                <div className="text-right">
                  <Badge variant="success" size="sm" dot>
                    Active on NHAI NETC
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-bold">₹</span>
                  <input
                    type="number"
                    value={fastagRechargeAmount}
                    onChange={(e) => setFastagRechargeAmount(e.target.value)}
                    placeholder="1000"
                    className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm text-white font-mono"
                  />
                </div>
                <Button
                  onClick={handleFastagRecharge}
                  variant="primary"
                  size="md"
                  icon={<IndianRupee className="w-4 h-4" />}
                >
                  Instant UPI Recharge
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Connected Car Telematics & Notification Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Connected Car Telematics Sync */}
          <Card
            header={
              <span className="flex items-center gap-2 text-sm font-bold text-white">
                <Radio className="w-4 h-4 text-cyan-400" />
                Connected Car Telematics Integrations
              </span>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-dark-850 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {activeVehicle?.connectedCarPlatform || 'OEM Telematics API'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Live sync of ODO, fuel, DTC codes & TPMS
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setConnectedSync(!connectedSync);
                    showToast(
                      !connectedSync ? 'Connected car sync enabled.' : 'Sync paused.',
                      'info'
                    );
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    connectedSync ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-dark-950 transition-transform ${
                      connectedSync ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Supported Indian OEMs */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Supported Indian OEM Platforms
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-dark-850 border border-slate-800 text-slate-300 flex items-center justify-between">
                    <span>Mahindra AdrenoX</span>
                    <span className="text-emerald-400 font-bold">✓ Synced</span>
                  </div>
                  <div className="p-2 rounded-lg bg-dark-850 border border-slate-800 text-slate-300 flex items-center justify-between">
                    <span>Tata iRA / ZConnect</span>
                    <span className="text-emerald-400 font-bold">✓ Ready</span>
                  </div>
                  <div className="p-2 rounded-lg bg-dark-850 border border-slate-800 text-slate-300 flex items-center justify-between">
                    <span>Hyundai Bluelink</span>
                    <span className="text-emerald-400 font-bold">✓ Ready</span>
                  </div>
                  <div className="p-2 rounded-lg bg-dark-850 border border-slate-800 text-slate-300 flex items-center justify-between">
                    <span>Suzuki Connect</span>
                    <span className="text-emerald-400 font-bold">✓ Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Notification Toggles */}
          <Card
            header={
              <span className="flex items-center gap-2 text-sm font-bold text-white">
                <Bell className="w-4 h-4 text-amber-400" />
                Intelligent Notification Thresholds
              </span>
            }
          >
            <div className="space-y-3">
              {[
                {
                  key: 'serviceReminders' as const,
                  title: 'Periodic Service Due Alert',
                  desc: 'Notify 1,000 km or 15 days before scheduled service',
                },
                {
                  key: 'pucExpiry' as const,
                  title: 'PUC Pollution Expiry Warning',
                  desc: 'MoRTH reminder 30 days before certificate expiration',
                },
                {
                  key: 'insuranceRenewal' as const,
                  title: 'Motor Insurance Renewal',
                  desc: 'Zero-dep policy quotes 45 days prior to lapse',
                },
                {
                  key: 'fastagLowBalance' as const,
                  title: 'FASTag Low Balance Alert',
                  desc: 'Alert when wallet balance drops below ₹500',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-dark-850 border border-slate-800"
                >
                  <div className="pr-2">
                    <p className="text-xs font-semibold text-white">{item.title}</p>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleAlert(item.key)}
                    className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                      alerts[item.key] ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-3.5 h-3.5 rounded-full bg-dark-950 transition-transform ${
                        alerts[item.key] ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Authentication & Session Security Card */}
          <Card
            header={
              <span className="flex items-center gap-2 text-sm font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Authentication & Security Session
              </span>
            }
          >
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-dark-850 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Account Type:</span>
                  <Badge variant={isGuest ? 'warning' : 'success'} size="xs">
                    {isGuest ? 'Guest / Demo Mode' : 'Supabase Authenticated'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Row Level Security:</span>
                  <span className="text-emerald-400 font-medium">✓ Active (Isolated User UID)</span>
                </div>
                {user?.id && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">User UID:</span>
                    <span className="font-mono text-slate-300 text-[10px] truncate max-w-[180px]">
                      {user.id}
                    </span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleSignOut}
                variant="danger"
                size="md"
                className="w-full"
                icon={<LogOut className="w-4 h-4" />}
              >
                Sign Out from AutoSphere
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
