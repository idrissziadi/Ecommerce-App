import React, { useState } from 'react';
import { Grid, Paper, TextField, Button, Typography, Link, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { keyframes } from '@emotion/react';
import { useTheme } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import back from './../assets/back.jpg';

// Animation for the form
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-10px);
  }
  to {
    transform: translateY(0);
  }
`;

const LoginPage = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user info
        localStorage.setItem('token', data.token); // Store JWT token
  
        // Check the user's role and redirect accordingly
        const userRole = data.user.role; // Assuming the role is stored in data.user.role
  
        if (userRole === 'admin') {
          setSuccess('Login successful! Redirecting to Admin Dashboard...');
          setError('');
          setTimeout(() => {
            window.location.href = '/admin-dashboard'; // Redirect admin to admin dashboard
          }, 1000);
        } else {
          setSuccess('Login successful! Redirecting to Home...');
          setError('');
          setTimeout(() => {
            window.location.href = '/'; // Redirect other users to the home page
          }, 1000);
        }
      } else {
        setError(data.message || 'Invalid email or password.');
        setSuccess('');
      }
    } catch (error) {
      setError('Server error. Please try again later.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Grid
      container
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundImage: `url(${back})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        animation: `${fadeIn} 0.5s ease-in-out`,
        overflow: 'hidden',
      }}
    >
      <Grid item xs={12} sm={8} md={4}>
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            borderRadius: 2,
            animation: `${slideIn} 0.5s ease-in-out`,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom color={theme.palette.primary.main}>
            Login
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Please enter your email and password to login.
          </Typography>
          {error && <Typography color="error" sx={{ marginBottom: 2 }}>{error}</Typography>}
          {success && <Typography color="success.main" sx={{ marginBottom: 2 }}>{success}</Typography>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="email"
              margin="normal"
              required
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              name="password"
              margin="normal"
              required
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              sx={{ marginBottom: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
            <Typography variant="body2">
              Don&apos;t have an account?{' '}
              <Link href="/signup" color="secondary" underline="hover">
                Sign Up
              </Link>
            </Typography>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
