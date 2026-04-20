import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from '@/router/routes';
import { DashboardLayout } from './DashboardLayout';

/**
 * Dispatches the user to the unified DashboardLayout
 * which handles role-based content internally.
 */
const DashboardDispatcher: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  // Redirect to login if not authenticated
  if (!token || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <DashboardLayout />;
};

export default DashboardDispatcher;
