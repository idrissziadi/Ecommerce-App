import React, { useState } from 'react';
import { Grid, Paper, TextField, Button, Typography, Link, CircularProgress, Box, InputAdornment, IconButton } from '@mui/material';
import { keyframes } from '@emotion/react';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import image from './../assets/back.jpg';

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

const SignupPage = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.phone_number) {
      setErrorMessage('Please fill out all fields.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage('Please enter a valid email.');
      return false;
    }
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Sign-up successful! You can now log in.');
        setErrorMessage('');
        setFormData({ username: '', email: '', password: '', phone_number: '' });
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      } else {
        setErrorMessage(data.message || 'Error signing up.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again later.');
      setSuccessMessage('');
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
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: theme.palette.text.primary,
      }}
    >
      <Grid item xs={12} sm={8} md={4}>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 2,
            animation: `${fadeIn} 0.5s ease-in-out`,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Sign Up
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" sx={{ marginBottom: 3 }}>
            Please fill in the form to create your account
          </Typography>
          {errorMessage && <Typography color="error" align="center" sx={{ marginBottom: 2 }}>{errorMessage}</Typography>}
          {successMessage && <Typography color="success.main" align="center" sx={{ marginBottom: 2 }}>{successMessage}</Typography>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              label="Username"
              name="username"
              margin="normal"
              required
              value={formData.username}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
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
            <TextField
              fullWidth
              variant="outlined"
              label="Phone Number"
              name="phone_number"
              margin="normal"
              type="tel"
              value={formData.phone_number}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
            </Button>
            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <Link href="/login" color="secondary">
                Log In
              </Link>
            </Typography>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SignupPage;
