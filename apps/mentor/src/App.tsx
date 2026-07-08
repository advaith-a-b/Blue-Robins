import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import HomeDashboard from './pages/HomeDashboard';
import GradingQueue from './pages/GradingQueue';
import SessionManager from './pages/SessionManager';
import BadgeIssuer from './pages/BadgeIssuer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<HomeDashboard />} />
          <Route path="grading" element={<GradingQueue />} />
          <Route path="sessions" element={<SessionManager />} />
          <Route path="badges" element={<BadgeIssuer />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
