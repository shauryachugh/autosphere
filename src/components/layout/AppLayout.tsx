import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../common/ToastContainer';
import { LogExpenseModal } from '../modals/LogExpenseModal';
import { BookServiceModal } from '../modals/BookServiceModal';
import { AddVehicleModal } from '../modals/AddVehicleModal';
import { ValuationModal } from '../modals/ValuationModal';

export const AppLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        isMobileOpen={mobileSidebarOpen}
        setIsMobileOpen={setMobileSidebarOpen}
      />

      {/* Top Navbar */}
      <Navbar
        sidebarCollapsed={sidebarCollapsed}
        onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
      />

      {/* Main Page Content */}
      <main
        className={`
          flex-1 
          transition-all duration-300 ease-in-out
          pb-20 lg:pb-8
          ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Modals & Toast Manager */}
      <LogExpenseModal />
      <BookServiceModal />
      <AddVehicleModal />
      <ValuationModal />
      <ToastContainer />
    </div>
  );
};
