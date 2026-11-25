import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// 9 Core AutoSphere Pages
import { Dashboard } from './pages/Dashboard';
import { Recommendations } from './pages/Recommendations';
import { CostIntelligence } from './pages/CostIntelligence';
import { Garage } from './pages/Garage';
import { VehicleHealth } from './pages/VehicleHealth';
import { AICoPilot } from './pages/AICoPilot';
import { AccessoriesHub } from './pages/AccessoriesHub';
import { ProfileSettings } from './pages/ProfileSettings';
import { PricingCatalogue } from './pages/PricingCatalogue';
import { VehiclePassport } from './pages/VehiclePassport';
import { DocumentVault } from './pages/DocumentVault';
import { MaintenanceTimeline } from './pages/MaintenanceTimeline';
import { RemindersCenter } from './pages/RemindersCenter';

// Authentication Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Core Application Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/pricing" element={<PricingCatalogue />} />
                <Route path="/ownership-cost" element={<CostIntelligence />} />
                <Route path="/garage" element={<Garage />} />
                <Route path="/passport" element={<VehiclePassport />} />
                <Route path="/vehicle-health" element={<VehicleHealth />} />
                <Route path="/documents" element={<DocumentVault />} />
                <Route path="/timeline" element={<MaintenanceTimeline />} />
                <Route path="/reminders" element={<RemindersCenter />} />
                <Route path="/ai-assistant" element={<AICoPilot />} />
                <Route path="/accessories" element={<AccessoriesHub />} />
                <Route path="/settings" element={<ProfileSettings />} />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
