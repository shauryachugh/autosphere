import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// 9 Core AutoSphere Pages
import { Dashboard } from './pages/Dashboard';
import { Recommendations } from './pages/Recommendations';
import { CostIntelligence } from './pages/CostIntelligence';
import { Garage } from './pages/Garage';
import { VehicleHealth } from './pages/VehicleHealth';
import { AICoPilot } from './pages/AICoPilot';
import { BuyAndSell } from './pages/BuyAndSell';
import { AccessoriesHub } from './pages/AccessoriesHub';
import { ProfileSettings } from './pages/ProfileSettings';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/ownership-cost" element={<CostIntelligence />} />
            <Route path="/garage" element={<Garage />} />
            <Route path="/vehicle-health" element={<VehicleHealth />} />
            <Route path="/ai-assistant" element={<AICoPilot />} />
            <Route path="/buy-sell" element={<BuyAndSell />} />
            <Route path="/accessories" element={<AccessoriesHub />} />
            <Route path="/settings" element={<ProfileSettings />} />
            {/* Catch-all redirect to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
