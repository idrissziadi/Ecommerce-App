import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Drawer,
  List,
  ListItem,
  Divider,
  TextField,
  IconButton,
  Alert,
  Chip,
  Toolbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { useCart } from '../context/useCart';

const Home2 = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('priceAsc');
  const [isGridView, setIsGridView] = useState(true);
  const { cart, handleAddToCart, handleRemoveFromCart, handleQuantityChange, setCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  useEffect(() => {
    // Fetch categories from the API
    // Faites la requête fetch avec les en-têtes d'authentification
     fetch('http://localhost:3000/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Ajoutez le token dans les en-têtes
        },
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  // Sorting function
  const sortCategories = (categories, sortOption) => {
    return [...categories].sort((a, b) => {
      if (sortOption === 'priceAsc') {
        return (a.products[0]?.price || 0) - (b.products[0]?.price || 0);
      } else if (sortOption === 'priceDesc') {
        return (b.products[0]?.price || 0) - (a.products[0]?.price || 0);
      }
      return 0;
    });
  };

  const handleCartToggle = () => {
    setIsCartOpen((prev) => !prev);
  };

  const handleCategoryClick = (category) => {
    const productsByCategory = category.products || [];
    navigate('/home', {
      state: {
        productsByCategory,
      },
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Add search logic here
  };

  const handleFilterToggle = () => {
    setFilterOpen((prev) => !prev);
    // Add filter logic here
  };



  const handleViewToggle = () => {
    setIsGridView((prev) => !prev);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCategories = sortCategories(filteredCategories, sortOption);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onCartClick={handleCartToggle} />
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', padding: 2 }}>
          <Box display="flex" alignItems="center">
            <TextField
              variant="outlined"
              placeholder="Recherche..."
              size="small"
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
            />

          </Box>
          <Box>
            <IconButton onClick={handleViewToggle} color="primary" title="Changer de vue">
              {isGridView ? <ViewListIcon /> : <ViewModuleIcon />}
            </IconButton>
          </Box>
        </Toolbar>
        <Drawer anchor="right" open={isCartOpen} onClose={handleCartToggle}>
          <Box sx={{ width: 300, padding: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom>Panier</Typography>
            <Divider />
            <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {cart.map((item) => (
                <ListItem key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                    <Typography variant="subtitle1">{item.name}</Typography>
                    <Typography variant="body2" color="textSecondary">Quantité:</Typography>
                    <TextField
                      type="number"
                      size="small"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                      sx={{ width: 60, marginBottom: 1 }}
                      inputProps={{ min: 1 }}
                    />
                    <Typography variant="body2">Prix: ${item.price * item.quantity}</Typography>
                  </Box>
                  <IconButton color="error" onClick={() => handleRemoveFromCart(item.id)} aria-label="Supprimer">
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ marginY: 2 }} />
            <Box sx={{ padding: 1, marginBottom: 2 }}>
              <Typography variant="h6">Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0)}</Typography>
              <Chip label={`${cart.length} article(s)`} color="primary" sx={{ marginY: 1 }} />
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => navigate('/orders', { state: { cart } })}
              sx={{ marginBottom: 1 }}
            >
              Commander
            </Button>
            {cart.length === 0 && (
              <Alert severity="info" sx={{ marginTop: 2 }}>
                Votre panier est vide.
              </Alert>
            )}
          </Box>
        </Drawer>
        {/* Contenu principal de la page */}
        <Box sx={{ padding: 3 }}>
          <Grid container spacing={2} justifyContent="center">
            {sortedCategories.map((category) => (
              <Grid item xs={12} sm={isGridView ? 6 : 12} md={isGridView ? 4 : 12} key={category.id}>
                <Card sx={{ display: 'flex', flexDirection: isGridView ? 'column' : 'row', alignItems: 'center' , maxHeight : isGridView ?  500 : 'auto' }}>
                  <CardMedia
                    component="img"
                    sx={{ width: isGridView ? 300 : 150,  height: 200, objectFit: 'cover'  }} 
                    image={category.products.length > 0 ? category.products[0].image_url : '/default-image.png'}
                    alt={category.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{category.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleCategoryClick(category)}
                    >
                      Voir plus
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default Home2;
