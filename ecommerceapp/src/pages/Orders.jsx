import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Typography, TextField, Card, CardContent, Divider, Box, Container, List, ListItem, ListItemText } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Orders = () => {
  const location = useLocation();
  const { cart } = location.state || { cart: [] }; 
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const [orderSuccess, setOrderSuccess] = useState('');
  const [orderError, setOrderError] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const handleOrderSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          shippingAddress: shippingAddress,
          items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
          })),
          totalPrice: cart.reduce((total, item) => total + item.price * item.quantity, 0),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrderSuccess('Commande passée avec succès !');
        setOrderError('');
        // Optionnel: vider le panier ou rediriger l'utilisateur
      } else {
        setOrderError(data.message || 'Erreur lors du passage de la commande.');
      }
    } catch (error) {
      setOrderError('Erreur de serveur. Veuillez réessayer plus tard.');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Facture</title>');
    printWindow.document.write('<style>@media print { .no-print { display: none; } }</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(document.getElementById('invoice-card').outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar/>
      <Container maxWidth="lg" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <Typography variant="h4" gutterBottom style={{ marginBottom: '20px' }}>Facture</Typography>
        
        {orderError && <Typography color="error">{orderError}</Typography>}
        {orderSuccess && <Typography color="primary">{orderSuccess}</Typography>}

        <Card variant="outlined" style={{ width: '100%', maxWidth: '800px', padding: '20px' }} id="invoice-card">
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box>
                <Typography variant="h6">Informations sur l'utilisateur</Typography>
                <Typography>Nom: {user.name}</Typography>
                <Typography>Email: {user.email}</Typography>
                <TextField
                  label="Adresse de livraison"
                  variant="outlined"
                  fullWidth
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  style={{ marginTop: '10px' }}
                />
              </Box>
              <Box>
                <Typography variant="h6" align="right">Détails de la marque</Typography>
                <Typography align="right">Marque XYZ</Typography>
                <Typography align="right">Adresse de la marque</Typography>
                <Typography align="right">Téléphone: 123-456-7890</Typography>
                <Typography align="right">Email: contact@marque.xyz</Typography>
              </Box>
            </Box>
            <Divider />
            <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
              Détails de la commande
            </Typography>
            <List>
              {cart.length > 0 ? (
                cart.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText 
                      primary={item.name}
                      secondary={`Quantité: ${item.quantity} - Prix: $${item.price * item.quantity}`}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography>Votre panier est vide.</Typography>
              )}
            </List>
            <Divider style={{ marginTop: '20px' }} />
            <Typography variant="h6" align="right" style={{ marginTop: '20px' }}>
              Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0)}
            </Typography>
          </CardContent>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              className="no-print"
            >
              Imprimer
            </Button>
          </Box>
        </Card>

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleOrderSubmit}
          style={{ marginTop: '20px' }}
          disabled={!shippingAddress} // Désactiver le bouton si l'adresse est vide
        >
          Commander
        </Button>
      </Container>
      <Footer/>
    </div>
  );
};

export default Orders;
