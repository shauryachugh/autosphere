import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, 
  Bell, 
  PlusCircle, 
  Search, 
  Wrench, 
  TrendingUp, 
  CheckCheck,
  ChevronDown,
  Car,
  LogOut
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { NumberPlate } from '../common/NumberPlate';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  sidebarCollapsed: boolean;
  onOpenMobileSidebar: () => void;
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  sidebarCollapsed,
  onOpenMobileSidebar,
}) => {
  const { 
    activeVehicle, 
    vehicles, 
    setActiveVehicleId, 
    unreadNotificationCount, 
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    openLogExpense,
    openBookService,
    openValuation,
    openAddVehicle,
    userProfile,
    showToast
  } = useApp();

  const { user, profile, signOut, isGuest } = useAuth();
  const navigate = useNavigate();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [vehicleMenuOpen, setVehicleMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    showToast('Signed out of AutoSphere', 'info');
    navigate('/login', { replace: true });
  };

  return (
    <header
      className={`
        sticky top-0 z-30
        h-16
        bg-dark-950/80 backdrop-blur-md
        border-b border-slate-800/80
        px-4 sm:px-6
        flex items-center justify-between
        transition-all duration-300
        ${sidebarCollapsed ? 'lg:pl-24' : 'lg:pl-[19rem]'}
      `}
    >
      {/* Left: Mobile Toggle & Quick Vehicle Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 lg:hidden border border-slate-800"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Vehicle Selector Dropdown */}
        {vehicles.length > 0 && activeVehicle ? (
          <div className="relative">
            <button
              onClick={() => setVehicleMenuOpen(!vehicleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <Car className="w-4 h-4 text-cyan-400" />
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-white leading-tight">
                  {activeVehicle.make} {activeVehicle.model}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {activeVehicle.regNumber}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${vehicleMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {vehicleMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-dark-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Select Active Vehicle
                </div>
                <div className="space-y-1">
                  {vehicles.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setActiveVehicleId(v.id);
                        setVehicleMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                        v.id === activeVehicle.id
                          ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
                          : 'hover:bg-dark-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">{v.make} {v.model}</p>
                        <NumberPlate registrationNumber={v.regNumber} size="sm" isEV={v.fuelType === 'electric'} />
                      </div>
                      {v.id === activeVehicle.id && (
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-medium">
                          Active
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button
            onClick={openAddVehicle}
            variant="outline"
            size="sm"
            icon={<Car className="w-3.5 h-3.5 text-cyan-400" />}
          >
            Add Car
          </Button>
        )}
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Valuation Calculator */}
        <Button
          onClick={openValuation}
          variant="outline"
          size="sm"
          className="hidden md:inline-flex"
          icon={<TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
        >
          Check Value
        </Button>

        {/* Quick Book Service */}
        <Button
          onClick={openBookService}
          variant="outline"
          size="sm"
          className="hidden sm:inline-flex"
          icon={<Wrench className="w-3.5 h-3.5 text-sky-400" />}
        >
          Book Service
        </Button>

        {/* Quick Log Expense Button */}
        <Button
          onClick={openLogExpense}
          variant="primary"
          size="sm"
          icon={<PlusCircle className="w-4 h-4" />}
        >
          <span className="hidden sm:inline">Log Expense</span>
          <span className="sm:hidden">Log</span>
        </Button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl bg-dark-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-dark-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <Badge variant="electric" size="xs">
                      {unreadNotificationCount} new
                    </Badge>
                  )}
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer text-left ${
                      notif.read
                        ? 'bg-dark-850/60 border-slate-800/60 text-slate-400'
                        : 'bg-dark-800 border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-white">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.actionUrl && (
                      <Link
                        to={notif.actionUrl}
                        onClick={() => setNotificationsOpen(false)}
                        className="inline-block mt-2 text-[11px] text-cyan-400 hover:underline font-medium"
                      >
                        Take Action →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Mini Badge */}
        <Link
          to="/settings"
          className="flex items-center gap-2 p-1.5 rounded-xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-colors"
          title="Account Settings"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            {(profile?.full_name || user?.user_metadata?.full_name || userProfile.name).charAt(0)}
          </div>
          <span className="text-xs font-medium text-slate-200 hidden md:inline pr-1">
            {(profile?.full_name || user?.user_metadata?.full_name || userProfile.name).split(' ')[0]}
          </span>
        </Link>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="p-2 rounded-xl bg-dark-900 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Sign Out of AutoSphere"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
