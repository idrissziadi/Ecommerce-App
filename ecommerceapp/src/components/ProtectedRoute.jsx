import React from 'react';
import { Navigate } from 'react-router-dom';

// This component will be used to protect routes
const ProtectedRoute = ({ element, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if user is authenticated

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
