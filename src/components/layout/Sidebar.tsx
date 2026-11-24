import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Sparkles, 
  Coins, 
  Warehouse, 
  Activity, 
  Bot, 
  CarFront, 
  ShoppingBag, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Radio, 
  ShieldCheck,
  Plus,
  LogOut,
  Calculator,
  Award,
  FileText,
  Bell,
  Clock
} from 'lucide-react';
import { NumberPlate } from '../common/NumberPlate';
import { Badge } from '../common/Badge';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { 
    activeVehicle, 
    vehicles, 
    setActiveVehicleId, 
    unreadNotificationCount,
    diagnostics,
    openAddVehicle,
    showToast
  } = useApp();

  const { user, profile, signOut, isGuest } = useAuth();
  const navigate = useNavigate();

  const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    showToast('Signed out of AutoSphere', 'info');
    navigate('/login', { replace: true });
  };

  const unresolvedAlertsCount = diagnostics.filter((d) => !d.isResolved && d.severity !== 'info').length;

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    },
    {
      name: 'Smart Car Recs',
      path: '/recommendations',
      icon: <Sparkles className="w-5 h-5 shrink-0" />,
      badge: 'Save ₹1.1L',
      badgeVariant: 'electric' as const,
    },
    {
      name: 'On-Road Pricing',
      path: '/pricing',
      icon: <Calculator className="w-5 h-5 shrink-0" />,
      badge: '36 States',
      badgeVariant: 'electric' as const,
    },
    {
      name: 'Ownership Cost',
      path: '/ownership-cost',
      icon: <Coins className="w-5 h-5 shrink-0" />,
    },
    {
      name: 'My Garage',
      path: '/garage',
      icon: <Warehouse className="w-5 h-5 shrink-0" />,
      badge: `${vehicles.length}`,
      badgeVariant: 'neutral' as const,
    },
    {
      name: 'Vehicle Passport',
      path: '/passport',
      icon: <Award className="w-5 h-5 shrink-0" />,
      badge: 'Verified',
      badgeVariant: 'electric' as const,
    },
    {
      name: 'Vehicle Health',
      path: '/vehicle-health',
      icon: <Activity className="w-5 h-5 shrink-0" />,
      badge: unresolvedAlertsCount > 0 ? `${unresolvedAlertsCount} Alert` : undefined,
      badgeVariant: 'warning' as const,
    },
    {
      name: 'Document Vault',
      path: '/documents',
      icon: <FileText className="w-5 h-5 shrink-0" />,
      badge: 'DigiLocker',
      badgeVariant: 'neutral' as const,
    },
    {
      name: 'Reminders',
      path: '/reminders',
      icon: <Bell className="w-5 h-5 shrink-0" />,
      badge: 'PUC / Ins',
      badgeVariant: 'warning' as const,
    },
    {
      name: 'Timeline',
      path: '/timeline',
      icon: <Clock className="w-5 h-5 shrink-0" />,
    },
    {
      name: 'AutoSphere AI',
      path: '/ai-assistant',
      icon: <Bot className="w-5 h-5 shrink-0" />,
      badge: 'Gemini',
      badgeVariant: 'purple' as const,
    },
    {
      name: 'Buy & Sell',
      path: '/buy-sell',
      icon: <CarFront className="w-5 h-5 shrink-0" />,
      badge: 'TruePrice',
      badgeVariant: 'electric' as const,
    },
    {
      name: 'Accessories Hub',
      path: '/accessories',
      icon: <ShoppingBag className="w-5 h-5 shrink-0" />,
    },
    {
      name: 'Profile & Settings',
      path: '/settings',
      icon: <Settings className="w-5 h-5 shrink-0" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-40
          bg-dark-900 border-r border-slate-800/80
          transition-all duration-300 ease-in-out
          flex flex-col justify-between
          ${collapsed ? 'w-20' : 'w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top: Brand Header */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-glow-blue shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                </div>
              </div>

              {!collapsed && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                      Auto<span className="text-cyan-400">Sphere</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded">
                      IN
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                    Automotive Intelligence
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 border border-transparent hover:border-slate-700 transition-colors"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Active Vehicle Switcher Mini Card */}
          <div className="p-3 border-b border-slate-800/80">
            {!collapsed ? (
              vehicles.length > 0 && activeVehicle ? (
                <div className="relative">
                  <div
                    onClick={() => setVehicleDropdownOpen(!vehicleDropdownOpen)}
                    className="p-2.5 rounded-xl bg-dark-850 border border-slate-700/60 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={activeVehicle.image}
                        alt={activeVehicle.model}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0 flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">
                            {activeVehicle.make} {activeVehicle.model}
                          </span>
                          {activeVehicle.fuelType === 'electric' && (
                            <span className="text-[9px] px-1 bg-emerald-500/20 text-emerald-300 rounded font-semibold">
                              EV
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <NumberPlate
                            registrationNumber={activeVehicle.regNumber}
                            size="sm"
                            isEV={activeVehicle.fuelType === 'electric'}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-slate-400 group-hover:text-cyan-400 pl-1 shrink-0">
                      <ChevronRight className={`w-4 h-4 transition-transform ${vehicleDropdownOpen ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {/* Dropdown for Vehicle Switcher */}
                  {vehicleDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-dark-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 space-y-1">
                      <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                        Switch Garage Vehicle
                      </div>
                      {vehicles.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => {
                            setActiveVehicleId(v.id);
                            setVehicleDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors text-xs ${
                            v.id === activeVehicle.id
                              ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold'
                              : 'hover:bg-dark-800 text-slate-300'
                          }`}
                        >
                          <div className="truncate">
                            <p className="font-medium text-white">{v.make} {v.model}</p>
                            <p className="text-[10px] text-slate-400">{v.regNumber}</p>
                          </div>
                          {v.id === activeVehicle.id && (
                            <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                          )}
                        </button>
                      ))}
                      <div className="pt-1 border-t border-slate-800">
                        <button
                          onClick={() => {
                            setVehicleDropdownOpen(false);
                            openAddVehicle();
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-lg text-xs text-cyan-400 hover:bg-cyan-500/10 transition-colors font-medium"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add New Vehicle</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={openAddVehicle}
                  className="w-full p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2 text-xs font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Vehicle</span>
                </button>
              )
            ) : (
              vehicles.length > 0 && activeVehicle ? (
                <div 
                  onClick={() => setCollapsed(false)}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-dark-850 hover:bg-dark-800 cursor-pointer border border-slate-700/60"
                  title={`${activeVehicle.make} ${activeVehicle.model} (${activeVehicle.regNumber})`}
                >
                  <img
                    src={activeVehicle.image}
                    alt={activeVehicle.model}
                    className="w-8 h-8 rounded-md object-cover border border-slate-700"
                  />
                </div>
              ) : (
                <div 
                  onClick={openAddVehicle}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 cursor-pointer border border-cyan-500/30"
                  title="Add Vehicle"
                >
                  <Plus className="w-5 h-5 text-cyan-400" />
                </div>
              )
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                  ${isActive
                    ? 'bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/30 shadow-[0_0_12px_rgba(0,210,255,0.1)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-dark-800/80 border border-transparent'
                  }
                  ${collapsed ? 'justify-center px-0' : ''}
                `}
                title={collapsed ? item.name : undefined}
              >
                <span className="text-slate-400 group-hover:text-cyan-400 transition-colors">
                  {item.icon}
                </span>

                {!collapsed && (
                  <span className="truncate flex-1 tracking-wide">{item.name}</span>
                )}

                {!collapsed && item.badge && (
                  <Badge variant={item.badgeVariant} size="xs">
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Telematics & Status Bar */}
        <div className="p-3 border-t border-slate-800/80 bg-dark-900/60 space-y-2">
          {!collapsed ? (
            <>
              <div className="p-2.5 rounded-xl bg-dark-850/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>{activeVehicle?.connectedCarPlatform || 'OBD-II Telematics'}</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                    LIVE
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                  <span className="text-slate-400 text-[11px]">FASTag Balance:</span>
                  <span className="text-white font-semibold font-mono">
                    ₹{(activeVehicle?.fastagBalanceINR || 1500).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* User row with Sign Out */}
              <div className="flex items-center justify-between px-1 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                    {(profile?.full_name || user?.user_metadata?.full_name || 'S').charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate text-[11px]">
                      {profile?.full_name || user?.user_metadata?.full_name || 'Shaurya Sharma'}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate font-mono">
                      {isGuest ? 'Demo Driver' : user?.email || 'Logged In'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2" title="Telematics Live">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-glow-subtle" />
              <button
                onClick={handleSignOut}
                className="p-1 rounded text-slate-500 hover:text-rose-400"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
