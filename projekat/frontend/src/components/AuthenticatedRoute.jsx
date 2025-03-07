import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = window.sessionStorage.getItem('auth_token') !== null;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // if not authenticated, grants access to child components
  return <Outlet />;
};

export default ProtectedRoute;