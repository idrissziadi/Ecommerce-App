import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Home2 from './pages/Home2';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard'; // Page réservée aux admins
import theme from './theme';
import { ThemeProvider } from '@mui/material';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import AdminRoute from './components/AdminRoute'; // Import AdminRoute
import Users from './components/Users';
import Products from './components/Products';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute element={<Home2 />} />} />
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={<ProtectedRoute element={<Orders />} />} />
          <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Route pour les administrateurs uniquement */}
          <Route path="/admin-dashboard" element={<AdminRoute element={<AdminDashboard />} />} />
          <Route path="/products" element={<AdminRoute element={<Products/>} />} />
          <Route path="/users" element={<AdminRoute element={<Users/>} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
