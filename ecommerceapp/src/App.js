import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Home2 from './pages/Home2';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import Signup from './pages/Signup';
import theme from './theme';
import { ThemeProvider } from '@mui/material';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

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
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
