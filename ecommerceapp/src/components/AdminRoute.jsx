
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Vérifie si l'utilisateur est connecté
  const user =  JSON.parse(localStorage.getItem('user'));
  const userRole = user.role;

  // Vérification si l'utilisateur est authentifié et s'il est admin
  return isAuthenticated && userRole === 'admin' ? element : <Navigate to="/login" />;
};

export default AdminRoute;
