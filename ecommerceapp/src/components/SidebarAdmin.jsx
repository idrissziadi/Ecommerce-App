import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, createTheme, ThemeProvider } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import OrdersIcon from '@mui/icons-material/Assignment'; // Icon for Orders
import ProductsIcon from '@mui/icons-material/Category'; // Icon for Products
import UsersIcon from '@mui/icons-material/Group'; // Icon for Users
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTheme } from '@emotion/react';

const drawerWidth = 240;


const SidebarAdmin = () => {
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  
  // User from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // Functions to open/close profile menu and drawer
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        {/* AppBar to show hamburger icon and title */}
        <Toolbar sx={{ width: '100%', justifyContent: 'space-between', bgcolor: 'primary.main' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ marginRight: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Admin Dashboard
          </Typography>
          <IconButton color="inherit" onClick={handleProfileMenuOpen}>
            <Avatar>{user ? user.username[0] : <AccountCircleIcon />}</Avatar>
          </IconButton>
        </Toolbar>

        {/* Drawer (Sidebar) */}
        <Drawer
          variant="temporary"
          open={openDrawer}
          onClose={toggleDrawer}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: 'primary.main' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {/* Orders Link */}
              <ListItem button component={RouterLink} to="/admin-dashboard">
                <ListItemIcon>
                  <OrdersIcon />
                </ListItemIcon>
                <ListItemText primary="Commandes" />
              </ListItem>

              {/* Products Link */}
              <ListItem button component={RouterLink} to="/products">
                <ListItemIcon>
                  <ProductsIcon />
                </ListItemIcon>
                <ListItemText primary="Produits" />
              </ListItem>

              {/* Users Link */}
              <ListItem button component={RouterLink} to="/users">
                <ListItemIcon>
                  <UsersIcon />
                </ListItemIcon>
                <ListItemText primary="Utilisateurs" />
              </ListItem>
            </List>
          </Box>
        </Drawer>

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
      </Box>
    </>
  );
};

export default SidebarAdmin;
