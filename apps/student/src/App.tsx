import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import HomeDashboard from './pages/HomeDashboard';
import MyProjects from './pages/MyProjects';
import MyAssignments from './pages/MyAssignments';
import MyNotes from './pages/MyNotes';
import Achievements from './pages/Achievements';
import Billing from './pages/Billing';
import Help from './pages/Help';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<HomeDashboard />} />
          <Route path="projects" element={<MyProjects />} />
          <Route path="assignments" element={<MyAssignments />} />
          <Route path="notes" element={<MyNotes />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="billing" element={<Billing />} />
          <Route path="help" element={<Help />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
