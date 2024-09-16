import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Menu, MenuItem, Avatar, Button } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = ({ onCartClick }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Get the user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cart');

    navigate('/login');
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Logo de l'application à gauche */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          TechnoStore
        </Typography>

        {/* Icônes à droite */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={onCartClick}
            color="inherit"
            aria-label="cart"
          >
            <ShoppingCartIcon />
          </IconButton>
          <IconButton
            component={RouterLink}
            to="/settings"
            color="inherit"
            aria-label="settings"
          >
            <SettingsIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="account"
            onClick={handleProfileMenuOpen}
          >
            <Avatar>{user ? user.username[0] : <AccountCircleIcon />}</Avatar>
          </IconButton>
        </Box>
      </Toolbar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      >
        <MenuItem disabled>{user ? `Hello, ${user.username}` : 'Welcome'}</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
