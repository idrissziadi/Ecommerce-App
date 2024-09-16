import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Snackbar, Alert, CircularProgress, MenuItem, Select
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SidebarAdmin from './SidebarAdmin';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1, 0),
}));

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(7);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    user_type: 'customer', // Default value
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('username');

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users
    .filter(user => user.username.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'email') {
        return a.email.localeCompare(b.email);
      } else if (sort === 'username') {
        return a.username.localeCompare(b.username);
      }
      return 0;
    })
    .slice(indexOfFirstUser, indexOfLastUser);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, user = null) => {
    setDialogMode(mode);
    setSelectedUser(user);
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: '', 
        phone_number: user.phone_number || '',
        user_type: user.user_type,
      });
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        phone_number: '',
        user_type: 'customer',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      let response;

      if (dialogMode === 'create') {
        response = await fetch('http://localhost:3000/api/users', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(formData),
        });
      } else if (dialogMode === 'edit') {
        response = await fetch(`http://localhost:3000/api/users/${selectedUser.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        fetchUsers();
        setSnackbarMessage(`${dialogMode === 'create' ? 'User added' : 'User updated'} successfully`);
      } else {
        const errorData = await response.json();
        setSnackbarMessage(errorData.message || 'Failed to save user');
      }
    } catch (error) {
      setSnackbarMessage('Server error');
    }
    setSnackbarOpen(true);
    handleCloseDialog();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.ok) {
        fetchUsers();
        setSnackbarMessage('User deleted successfully');
      } else {
        setSnackbarMessage('Failed to delete user');
      }
    } catch (error) {
      setSnackbarMessage('Server error');
    }
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <SidebarAdmin />
      <StyledPaper>
        <Typography variant="h4" gutterBottom>Utilisateurs</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog('create')}>
              Ajouter Utilisateur
            </Button>
          </Grid>
          <Grid item>
            <StyledTextField
              label="Filter par Nom Utilisateur"
              variant="outlined"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              displayEmpty
            >
              <MenuItem value="username">Trier par nom d'utilisateur</MenuItem>
              <MenuItem value="email">Trier par  Email</MenuItem>
            </Select>
          </Grid>
        </Grid>

        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <StyledTableContainer component={Paper}>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <StyledTableCell>Nom Utilisateur</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Téléphone</StyledTableCell>
                    <StyledTableCell>Type d'utilisateur</StyledTableCell>
                    <StyledTableCell>Actions</StyledTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {currentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <StyledTableCell>{user.username}</StyledTableCell>
                      <StyledTableCell>{user.email}</StyledTableCell>
                      <StyledTableCell>{user.phone_number || 'N/A'}</StyledTableCell>
                      <StyledTableCell>{user.user_type}</StyledTableCell>
                      <StyledTableCell>
                        <IconButton onClick={() => handleOpenDialog('edit', user)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(user.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>

            <Pagination
              count={Math.ceil(users.length / usersPerPage)}
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
              sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
            />
          </>
        )}

        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>{dialogMode === 'create' ? 'Ajouter Utilisateur ' : 'Modifier  Utilisateur'}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="username"
                    label="Nom Utilisateur"
                    variant="outlined"
                    fullWidth
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="password"
                    label="Mot De Passe"
                    variant="outlined"
                    fullWidth
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={dialogMode === 'create'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="phone_number"
                    label="Téléphone"
                    variant="outlined"
                    fullWidth
                    value={formData.phone_number}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Select
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value="customer">Customer</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </Grid>
              </Grid>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  Annuler
                </Button>
                <Button type="submit" color="primary">
                  {dialogMode === 'create' ? 'Ajouter' : 'Sauvgarder'}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarMessage.includes('error') ? 'error' : 'success'}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </StyledPaper>
    </div>
  );
};

export default Users;
