import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Role, useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
}

export const dashboardFor = (role: Role) =>
  role === 'student' ? '/student/dashboard' : '/teacher/dashboard';

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Not signed in: send to /login and remember where they were going.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Signed in with the wrong role: send them to their own dashboard.
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={dashboardFor(user.role)} replace />;
  }

  return <>{children}</>;
};
