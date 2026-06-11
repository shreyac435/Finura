import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';

// Pages
import Dashboard from '../pages/Dashboard';
import Income from '../pages/Income';
import Expenses from '../pages/Expenses';
import Budgets from '../pages/Budgets';
import Goals from '../pages/Goals';
import Reports from '../pages/Reports';
import Profile from '../pages/Profile';
import AiAdvisor from '../pages/AiAdvisor';
import Login from '../pages/Login';
import Register from '../pages/Register';

// Protected Route Guard
const PrivateRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// Public Route Guard (prevents logged in users from seeing login/register again)
const PublicRoute = ({ isLoggedIn, children }) => {
  return !isLoggedIn ? children : <Navigate to="/" replace />;
};

const AppRoutes = ({ isLoggedIn, user, onLogin, onRegister, onLogout, onSyncProfile }) => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route 
        path="/login" 
        element={
          <PublicRoute isLoggedIn={isLoggedIn}>
            <Login onLogin={onLogin} />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute isLoggedIn={isLoggedIn}>
            <Register onRegister={onRegister} />
          </PublicRoute>
        } 
      />

      {/* Private Dashboard Pages wrapped in Layout */}
      <Route 
        path="/" 
        element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <Layout user={user} onLogout={onLogout} />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="income" element={<Income />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="budgets" element={<Budgets />} />
        <Route path="goals" element={<Goals />} />
        <Route path="reports" element={<Reports />} />
        <Route path="ai-advisor" element={<AiAdvisor />} />
        <Route path="profile" element={<Profile user={user} onSyncProfile={onSyncProfile} />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
