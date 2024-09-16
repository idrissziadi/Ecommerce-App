import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, CircularProgress, Button, IconButton, Menu, MenuItem, Dialog,
  DialogTitle, DialogContent, DialogActions, Select, FormControl, InputLabel,
  Tooltip, Snackbar, Alert, Drawer, Card, CardContent, Grid, Chip, Avatar, Divider , Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from '@mui/icons-material/Info';
import SidebarAdmin from '../components/SidebarAdmin';
import { useTheme } from '@mui/material/styles';


const AdminDashboard = () => {
    const theme = useTheme();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [orderItemsDialogOpen, setOrderItemsDialogOpen] = useState(false);

  const statusOptions = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          setError('Failed to fetch orders');
        }
      } catch (error) {
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderId));
        setSnackbarMessage('Order deleted successfully');
      } else {
        setSnackbarMessage('Failed to delete order');
      }
    } catch (error) {
      setSnackbarMessage('Error deleting order');
    }

    setSnackbarOpen(true);
    handleMenuClose();
  };

  const handleMenuOpen = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleOpenStatusDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleChangeStatus = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${selectedOrder.id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(orders.map(order =>
          order.id === selectedOrder.id ? { ...order, status: newStatus } : order
        ));
        setSnackbarMessage('Order status updated successfully');
      } else {
        setSnackbarMessage('Failed to update order status');
      }
    } catch (error) {
      setSnackbarMessage('Error updating order status');
    }

    setSnackbarOpen(true);
    handleCloseStatusDialog();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleUserDrawerOpen = (order) => {
    setSelectedOrder(order);
    setUserDrawerOpen(true);
  };

  const handleUserDrawerClose = () => {
    setUserDrawerOpen(false);
    setSelectedOrder(null);
  };

  const handleOrderItemsDialogOpen = (order) => {
    setSelectedOrder(order);
    setOrderItemsDialogOpen(true);
  };

  const handleOrderItemsDialogClose = () => {
    setOrderItemsDialogOpen(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Shipped':
        return 'info';
      case 'Delivered':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <>
      <SidebarAdmin />
      <Paper sx={{ padding: 3, margin: 3 }}>
        <Typography variant="h4" gutterBottom>
          Commandes Dashboard
        </Typography>
        <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto', marginTop: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Commande ID</TableCell>
                <TableCell>Utilisateur</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Montant total</TableCell>
                <TableCell> adresse de livraison</TableCell>
                <TableCell>Articles</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    <Tooltip title="View User Info">
                      <IconButton onClick={() => handleUserDrawerOpen(order)}>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    {order.user?.username || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      onClick={() => handleOpenStatusDialog(order)}
                      icon={<EditIcon />}
                    />
                  </TableCell>
                  <TableCell>${order.total_amount || 'N/A'}</TableCell>
                  <TableCell>{order.shipping_address || 'N/A'}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOrderItemsDialogOpen(order)} variant="outlined">
                      View Items
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(event) => handleMenuOpen(event, order)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => handleOpenStatusDialog(order)}>Modifier Status</MenuItem>
                      <MenuItem onClick={() => handleDeleteOrder(order.id)}>Supprimer Commande</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={statusDialogOpen} onClose={handleCloseStatusDialog}>
          <DialogTitle>Modifier Status De Commande</DialogTitle>
          <DialogContent>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="Status"
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseStatusDialog}>Annuler</Button>
            <Button onClick={handleChangeStatus} variant="contained" color="primary">Modifier</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={orderItemsDialogOpen} onClose={handleOrderItemsDialogClose}>
          <DialogTitle>Articles en commande</DialogTitle>
          <DialogContent sx={{ minWidth: 500 }}>
            <Typography variant="h6">Articles en commande {selectedOrder?.id}</Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              {selectedOrder?.orderItems.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="body2">Quantité: {item.quantity}</Typography>
                      <Typography variant="body2">Prix: ${item.price}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOrderItemsDialogClose}>Close</Button>
          </DialogActions>
        </Dialog>

        <Drawer
        anchor="right"
        open={userDrawerOpen}
        onClose={handleUserDrawerClose}
        PaperProps={{
          sx: {
            width: 350,
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: theme.palette.background.paper,
            borderLeft: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[3],
          }
        }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Détails de l'utilisateur</Typography>
                <IconButton onClick={handleUserDrawerClose} color="primary">
                <CloseIcon />
                </IconButton>
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                {selectedOrder?.user ? (
                <div>
                    <Avatar
                    src={selectedOrder.user.avatarUrl}
                    sx={{ width: 80, height: 80, mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                    {selectedOrder.user.username || 'N/A'}
                    </Typography>
                    <Typography variant="body1">Email: {selectedOrder.user.email || 'N/A'}</Typography>
                    <Typography variant="body1">Téléphone: {selectedOrder.user.phone_number || 'N/A'}</Typography>
                </div>
                ) : (
                <Typography variant="body2">Aucune information utilisateur disponible</Typography>
                )}
            </Box>

        <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Tooltip title="Edit User">
              <IconButton color="primary" sx={{ mb: 1 }}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <button onClick={handleUserDrawerClose}>Fermer</button>
          </Box>
        </Box>
      </Drawer>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarMessage.includes('Error') ? 'error' : 'success'}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </>
  );
};

export default AdminDashboard;
