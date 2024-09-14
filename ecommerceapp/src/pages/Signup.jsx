import React, { useState } from 'react';
import { Grid, Paper, TextField, Button, Typography, Link, CircularProgress } from '@mui/material';
import { keyframes } from '@emotion/react';
import { useTheme } from '@mui/material/styles';
import image from './../assets/back.jpg';

// Animation pour le formulaire
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

  // États pour gérer les champs du formulaire et les messages
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validation du formulaire
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

  // Gestion de la soumission du formulaire
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
        setSuccessMessage('Inscription réussie! Vous pouvez maintenant vous connecter.');
        setErrorMessage('');
        setFormData({ username: '', email: '', password: '', phone_number: '' }); // Réinitialiser le formulaire
        setTimeout(() => {
          window.location.href = '/login'; // Redirection vers la page de connexion
        }, 1000);
      } else {
        setErrorMessage(data.message || 'Erreur lors de l\'inscription.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Erreur du serveur. Veuillez réessayer plus tard.');
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
            padding: 3,
            borderRadius: 2,
            animation: `${fadeIn} 0.5s ease-in-out`,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Sign Up
          </Typography>
          {errorMessage && <Typography color="error" align="center" sx={{ marginBottom: 2 }}>{errorMessage}</Typography>}
          {successMessage && <Typography color="success" align="center" sx={{ marginBottom: 2 }}>{successMessage}</Typography>}
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
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              name="password"
              margin="normal"
              required
              type="password"
              value={formData.password}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
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
