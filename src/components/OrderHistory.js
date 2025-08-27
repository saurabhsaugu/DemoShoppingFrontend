import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Alert, Box } from '@mui/material';

const OrderHistory = ({ userId, isLoggedIn, setSnackbar }) => {
  const [orderHistory, setOrderHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoggedIn && userId) {
      setLoading(true);
      axios.get(`/api/orders/history/${userId}`)
        .then(res => setOrderHistory(res.data))
        .catch(() => setError('Failed to load order history.'))
        .finally(() => setLoading(false));
    }
  }, [userId, isLoggedIn]);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 8 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!orderHistory || !orderHistory.orders || orderHistory.orders.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Order History</Typography>
        <Alert severity="info">No orders found.</Alert>
      </Box>
    );
  }

  // Sort orders in descending order by orderId before rendering
  const sortedOrders = [...orderHistory.orders].sort((a, b) => b.orderId - a.orderId);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Order History</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>User ID: {orderHistory.userID}</Typography>
      {sortedOrders.map(order => {
        const totalAmount = order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return (
          <Box key={order.orderId} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Order #{order.orderId}
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderItems.map(item => (
                    <TableRow key={item.productID}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              Total Amount: ₹{totalAmount.toFixed(2)}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default OrderHistory;
