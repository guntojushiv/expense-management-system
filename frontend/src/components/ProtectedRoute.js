import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  console.log('ProtectedRoute - Token:', token, 'Required Role:', role);

  if (!token) {
    console.log('No token, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload.role;
    console.log('ProtectedRoute - User Role:', userRole);

    if (role && userRole !== role && !(role === 'admin' && userRole === 'manager' && window.location.pathname === '/budget')) {
      console.log('Role mismatch, redirecting to login');
      return <Navigate to="/login" replace />;
    }
    return children;
  } catch (e) {
    console.log('Token parsing error:', e);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;