import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import OrderHistory from './components/OrderHistory';
import axios from 'axios';
import { ThemeProvider, createTheme, Container, Snackbar, Alert } from '@mui/material';

const theme = createTheme();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setSnackbar({ open: true, message: 'Logged out successfully!', severity: 'success' });
    window.location.replace('/login'); // Use hard redirect to replace history
    // Optionally, call backend logout endpoint
  };

  // Set axios base URL for API calls
  axios.defaults.baseURL = 'http://localhost:8080';
  axios.defaults.withCredentials = true;

  return (
    <ThemeProvider theme={theme}>
      {/* Router is now in index.js */}
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} setSnackbar={setSnackbar} />} />
          <Route path="/products" element={<ProductList isLoggedIn={isLoggedIn} userId={userId} setSnackbar={setSnackbar} />} />
          <Route path="/cart" element={isLoggedIn ? <Cart userId={userId} isLoggedIn={isLoggedIn} setSnackbar={setSnackbar} /> : <Navigate to="/login" />} />
          <Route path="/orders" element={isLoggedIn ? <OrderHistory userId={userId} isLoggedIn={isLoggedIn} setSnackbar={setSnackbar} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Container>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
