import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, CircularProgress, Alert, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Cart = ({ userId, isLoggedIn, setSnackbar }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoggedIn && userId) {
      setLoading(true);
      axios.get(`/api/cart/${userId}`)
        .then(res => {
          setCart(res.data);
          setItems(res.data.cartItems || []);
          setError('');
        })
        .catch(() => {
          setError('Failed to load cart.');
          setCart(null);
          setItems([]);
        })
        .finally(() => setLoading(false));
    }
  }, [userId, isLoggedIn]);

  const updateQuantity = async (productID, delta) => {
    const item = items.find(i => i.productID === productID);
    if (!item) return;
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) {
      // Delete the item if quantity goes below 1
      try {
        await axios.delete(`/api/cart/remove/${cart.cartId}/${productID}`);
        const newItems = items.filter(i => i.productID !== productID);
        setItems(newItems);
        setSnackbar({ open: true, message: 'Item removed.', severity: 'success' });
        if (newItems.length === 0 && cart) {
          await axios.delete(`/api/cart/delete/${cart.cartId}`);
          setCart(null);
        }
      } catch {
        setSnackbar({ open: true, message: 'Failed to remove item.', severity: 'error' });
      }
    } else {
      // Update quantity in backend
      try {
        await axios.put(`/api/cart/update-quantity/${cart.cartId}/${productID}/${newQuantity}`);
        setItems(items.map(i => i.productID === productID ? { ...i, quantity: newQuantity } : i));
        setSnackbar({ open: true, message: 'Quantity updated.', severity: 'success' });
      } catch {
        setSnackbar({ open: true, message: 'Failed to update quantity.', severity: 'error' });
      }
    }
  };

  const placeOrder = async () => {
    try {
      await axios.post(`/api/orders/place?username=${userId}`);
      setItems([]);
      setCart(null);
      setSnackbar({ open: true, message: 'Order placed successfully!', severity: 'success' });
      navigate('/orders'); // Navigate to orders page after placing order
    } catch {
      setSnackbar({ open: true, message: 'Failed to place order.', severity: 'error' });
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 8 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!cart) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Your Cart</Typography>
        <Alert severity="info">No product in cart.</Alert>
        <Button component={Link} to="/orders" variant="outlined" sx={{ mt: 2 }}>
          Go to Order History
        </Button>
      </Box>
    );
  }
  if (cart.message || items.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Your Cart</Typography>
        <Alert severity="info">{cart.message || "No product in cart."}</Alert>
        <Button component={Link} to="/orders" variant="outlined" sx={{ mt: 2 }}>
          Go to Order History
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Your Cart</Typography>
      {items.length === 0 ? (
        <Alert severity="info">Cart is empty.</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.productID}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell align="right">
                    <Button variant="outlined" color="primary" sx={{ minWidth: 32 }} onClick={() => updateQuantity(item.productID, 1)}>+</Button>
                    <Button variant="outlined" color="primary" sx={{ minWidth: 32, mx: 1 }} onClick={() => updateQuantity(item.productID, -1)}>-</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {items.length > 0 && (
        <Button variant="contained" color="primary" onClick={placeOrder} sx={{ mb: 2 }}>
          Order Items
        </Button>
      )}
    </Box>
  );
};

export default Cart;
