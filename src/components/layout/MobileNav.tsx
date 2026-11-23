import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Coins, Warehouse, Activity, Bot } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { diagnostics } = useApp();
  const alertCount = diagnostics.filter((d) => !d.isResolved && d.severity !== 'info').length;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Costs', path: '/ownership-cost', icon: <Coins className="w-5 h-5" /> },
    { name: 'Garage', path: '/garage', icon: <Warehouse className="w-5 h-5" /> },
    { 
      name: 'Health', 
      path: '/vehicle-health', 
      icon: <Activity className="w-5 h-5" />,
      hasBadge: alertCount > 0 
    },
    { name: 'SphereAI', path: '/ai-assistant', icon: <Bot className="w-5 h-5" /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-900/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-medium transition-all relative
            ${isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}
          `}
        >
          <div className="relative">
            {item.icon}
            {item.hasBadge && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-dark-900" />
            )}
          </div>
          <span className="mt-1">{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
};
