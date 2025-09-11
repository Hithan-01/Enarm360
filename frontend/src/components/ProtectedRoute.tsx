import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const hasRole = requiredRole === 'ADMIN' 
      ? authService.isAdmin() 
      : authService.isEstudiante();
    
    if (!hasRole) {
      // Redirigir al dashboard correcto según el rol del usuario
      const userRole = authService.isAdmin() ? 'admin' : 'estudiante';
      return <Navigate to={`/${userRole}/dashboard`} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;