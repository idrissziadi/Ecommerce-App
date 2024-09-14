import React, { useEffect, useState } from 'react';
import { Box, Grid, Toolbar, IconButton, TextField, Typography, Button, Drawer, List, ListItem, Divider, FormControlLabel, Checkbox, Card, CardMedia, CardContent, CardActions, Container, Select, MenuItem, InputLabel, FormControl , Chip , Alert , Slider , Tooltip} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterListIcon, ViewModule as ViewModuleIcon, ViewList as ViewListIcon, ShoppingCart as ShoppingCartIcon, Delete as DeleteIcon  } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';


const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state ; // Default to empty object if state is null or undefined
  const { productsByCategory } = state;
  const { cart, handleAddToCart, handleRemoveFromCart , handleQuantityChange , setCart } = useCart();
 
  const [products, setProducts] = useState(productsByCategory);
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [sortOption, setSortOption] = useState('');



  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewToggle = () => {
    setIsGridView((prev) => !prev);
  };

  const handleFilterToggle = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleCartToggle = () => {
    setIsCartOpen((prev) => !prev);
  };




  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    if (event.target.value === 'priceAsc') {
      setProducts([...products].sort((a, b) => a.price - b.price));
    } else if (event.target.value === 'priceDesc') {
      setProducts([...products].sort((a, b) => b.price - a.price));
    }
  };

  const filteredProducts = products.filter((product) =>
    product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  
  return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onCartClick={handleCartToggle}/>
      <Container maxWidth="lg">
        {/* Barre d'outils avec les options de tri et de vue */}
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
            <IconButton onClick={handleFilterToggle} color="primary" title="Filtres">
              <FilterListIcon />
            </IconButton>
            <FormControl variant="outlined" size="small" sx={{ marginLeft: 2 }}>
              <InputLabel>Tri</InputLabel>
              <Select value={sortOption} onChange={handleSortChange} label="Tri">
                <MenuItem value="priceAsc">Prix croissant</MenuItem>
                <MenuItem value="priceDesc">Prix décroissant</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <IconButton onClick={handleViewToggle} color="primary" title="Changer de vue">
              {isGridView ? <ViewListIcon /> : <ViewModuleIcon />}
            </IconButton>

          </Box>
        </Toolbar>

        {/* Barre latérale gauche pour les filtres */}
        <Drawer anchor="left" open={isFilterOpen} onClose={handleFilterToggle}>
        <Box sx={{ width: 300, padding: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Filtres
          </Typography>
          <Divider />
          <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {/* Stock uniquement */}
            <ListItem>
              <FormControlLabel control={<Checkbox />} label="En stock uniquement" />
            </ListItem>

            {/* Plage de prix */}
            <ListItem>
              <Box sx={{ width: '100%' }}>
                <Typography gutterBottom>Plage de prix</Typography>
                <Slider
                  min={0}
                  max={1000}
                  defaultValue={[0, 500]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `$${value}`}
                />
              </Box>
            </ListItem>

            {/* Catégorie */}
            <ListItem>
              <Box sx={{ width: '100%' }}>
                <InputLabel id="category-label">Catégorie</InputLabel>
                <Select
                  labelId="category-label"
                  defaultValue=""
                  fullWidth
                  variant="outlined"
                >
                  <MenuItem value="electronics">Électronique</MenuItem>
                  <MenuItem value="furniture">Mobilier</MenuItem>
                  <MenuItem value="clothing">Vêtements</MenuItem>
                  {/* Ajouter d'autres catégories si nécessaire */}
                </Select>
              </Box>
            </ListItem>

            {/* Note */}
            <ListItem>
              <Box sx={{ width: '100%' }}>
                <Typography gutterBottom>Note minimum</Typography>
                <TextField
                  type="number"
                  label="Note minimum"
                  variant="outlined"
                  size="small"
                  fullWidth
                  inputProps={{ min: 0, max: 5 }}
                />
              </Box>
            </ListItem>

            {/* Trier par */}
            <ListItem>
              <Box sx={{ width: '100%' }}>
                <InputLabel id="sort-label">Trier par</InputLabel>
                <Select
                  labelId="sort-label"
                  defaultValue="relevance"
                  fullWidth
                  variant="outlined"
                >
                  <MenuItem value="relevance">Pertinence</MenuItem>
                  <MenuItem value="price-asc">Prix croissant</MenuItem>
                  <MenuItem value="price-desc">Prix décroissant</MenuItem>
                  <MenuItem value="rating">Note</MenuItem>
                </Select>
              </Box>
            </ListItem>
          </List>

          <Box sx={{ paddingTop: 2 }}>
            <Tooltip title="Appliquer les filtres">
              <IconButton color="primary" onClick={() => console.log('Appliquer les filtres')}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        </Drawer>
    

        {/* Barre latérale droite pour le panier */}
        <Drawer anchor="right" open={isCartOpen} onClose={handleCartToggle}>
          <Box sx={{ width: 300, padding: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Panier
            </Typography>
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
            {/* Affichage du prix total */}
            <Box sx={{ padding: 1, marginBottom: 2 }}>
              <Typography variant="h6">Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0)}</Typography>
              <Chip label={`${cart.length} article(s)`} color="primary" sx={{ marginY: 1 }} />
            </Box>
            {/* Bouton Commander */}
            <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/orders', { state: { cart } })} sx={{ marginBottom: 1 }}>
              Commander
            </Button>
            {/* Message d'alerte si le panier est vide */}
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
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={isGridView ? 6 : 12} md={isGridView ? 4 : 12} key={product.id}>
                <Card sx={{ display: 'flex', flexDirection: isGridView ? 'column' : 'row', alignItems: 'center' , maxHeight : isGridView ?  500 : 'auto' }}>
                  <CardMedia
                    component="img"
                    sx={{ width: isGridView ? 300 : 150,  height: 200, objectFit: 'cover' }}         
                    image={product.image_url || '/default-image.png'}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {product.description}
                    </Typography>
                    <Typography variant="body1" color="text.primary">
                      ${product.price}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Stock: {product.stock}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddToCart(product)}
                    >
                      Ajouter au panier
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

export default Home;
