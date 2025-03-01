import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = window.sessionStorage.getItem('auth_token') !== null;

  // ako nije prijavljen, redirect ka login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ako je prijavljen daje pristup child page komponentama
  return <Outlet />;
};

export default ProtectedRoute;