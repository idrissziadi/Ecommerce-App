import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'gray',
        color: 'white',
        py: 2, // Padding Y (top and bottom)
        textAlign: 'center',
        mt: 'auto', // Margin top auto for sticky footer
      }}
    >
      <Typography variant="body2" gutterBottom>
        &copy; {new Date().getFullYear()} VotreApp. Tous droits réservés.
      </Typography>
      <Typography variant="body2">
        <Link href="/privacy" color="inherit" underline="none">
          Politique de confidentialité
        </Link>{' '}
        |{' '}
        <Link href="/terms" color="inherit" underline="none">
          Conditions d'utilisation
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
