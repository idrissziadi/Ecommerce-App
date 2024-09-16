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

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(7);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit'
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
    category_id: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('name');

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products
    .filter(product => product.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price') {
        return a.price - b.price;
      } else if (sort === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    })
    .slice(indexOfFirstProduct, indexOfLastProduct);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, product = null) => {
    setDialogMode(mode);
    setSelectedProduct(product);
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image_url: product.image_url,
        category_id: product.category_id
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        image_url: '',
        category_id: ''
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
        response = await fetch('http://localhost:3000/api/products', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(formData),
        });
      } else if (dialogMode === 'edit') {
        response = await fetch(`http://localhost:3000/api/products/${selectedProduct.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(formData),
        });
      }
  
      if (response.ok) {
        fetchProducts();
        setSnackbarMessage(`${dialogMode === 'create' ? 'Product added' : 'Product updated'} successfully`);
      } else {
        const errorData = await response.json();
        setSnackbarMessage(errorData.message || 'Failed to save product');
      }
    } catch (error) {
      setSnackbarMessage('Server error');
    }
    setSnackbarOpen(true);
    handleCloseDialog();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProducts();
        setSnackbarMessage('Product deleted successfully');
      } else {
        setSnackbarMessage('Failed to delete product');
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
        <Typography variant="h4" gutterBottom>Produits</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog('create')}>
              Ajouter Produit
            </Button>
          </Grid>
          <Grid item>
            <StyledTextField
              label="Filter par Nom"
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
              <MenuItem value="name">Trier par Nom</MenuItem>
              <MenuItem value="price">Trier par Prix</MenuItem>
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
                    <StyledTableCell>Nom</StyledTableCell>
                    <StyledTableCell>Description</StyledTableCell>
                    <StyledTableCell>Prix</StyledTableCell>
                    <StyledTableCell>Stock</StyledTableCell>
                    <StyledTableCell>Image URL</StyledTableCell>
                    <StyledTableCell>Category ID</StyledTableCell>
                    <StyledTableCell>Actions</StyledTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {currentProducts.map((product) => (
                    <TableRow key={product.id}>
                      <StyledTableCell>{product.name}</StyledTableCell>
                      <StyledTableCell>{product.description}</StyledTableCell>
                      <StyledTableCell>${product.price}</StyledTableCell>
                      <StyledTableCell>{product.stock}</StyledTableCell>
                      <StyledTableCell>{product.image_url}</StyledTableCell>
                      <StyledTableCell>{product.category_id}</StyledTableCell>
                      <StyledTableCell>
                        <IconButton onClick={() => handleOpenDialog('edit', product)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(product.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>

            <Pagination
              count={Math.ceil(products.length / productsPerPage)}
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
              sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
            />
          </>
        )}

        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>{dialogMode === 'create' ? 'Ajouter Produit' : 'Modifier Produit'}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="name"
                    label="Nom"
                    variant="outlined"
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="description"
                    label="Description"
                    variant="outlined"
                    fullWidth
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="price"
                    label="Prix"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="stock"
                    label="Stock"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    name="image_url"
                    label="Image URL"
                    variant="outlined"
                    fullWidth
                    value={formData.image_url}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    name="category_id"
                    label="Category ID"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </Grid>
              <DialogActions>
                <Button type="submit" variant="contained" color="primary">
                  {dialogMode === 'create' ? 'Ajouter' : 'Sauvegarder'}
                </Button>
                <Button onClick={handleCloseDialog} color="secondary">
                  Cancel
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
          <Alert onClose={handleSnackbarClose} severity="info">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </StyledPaper>
    </div>
  );
};

export default Products;
