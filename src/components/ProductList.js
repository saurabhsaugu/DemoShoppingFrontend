import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, Card, CardContent, CardActions, Typography, Button, CircularProgress, Alert } from '@mui/material';

const ProductList = ({ isLoggedIn, userId, setSnackbar }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
      return;
    }
    const fetchProducts = () => {
      setLoading(true);
      axios.get('/api/products')
        .then(res => setProducts(res.data))
        .catch(() => setError('Failed to load products.'))
        .finally(() => setLoading(false));
    };
    fetchProducts();
    const handlePageShow = (event) => {
      if (event.persisted) {
        fetchProducts();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [isLoggedIn]);

  const addToCart = async (productId) => {
    if (!isLoggedIn) {
      setSnackbar({ open: true, message: 'Please login to add to cart.', severity: 'warning' });
      return;
    }
    try {
      await axios.post('/api/cart/add', { username: userId, productId, quantity: 1 });
      setSnackbar({ open: true, message: 'Added to cart!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to add to cart.', severity: 'error' });
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 8 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Products</Typography>
      <Grid container spacing={3}>
        {products.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{p.name}</Typography>
                <Typography color="text.secondary">${p.price}</Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary" onClick={() => addToCart(p.id)}>
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ProductList;
