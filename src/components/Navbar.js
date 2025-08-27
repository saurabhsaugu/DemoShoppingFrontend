import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Navbar = ({ isLoggedIn, onLogout }) => (
  <AppBar position="static" color="primary">
    <Toolbar>
      <Typography variant="h6" component={Link} to="/products" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
        Online Shopping Site
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {isLoggedIn ? (
          <>
            <Button color="inherit" component={Link} to="/products">Products</Button>
            <Button color="inherit" component={Link} to="/cart">Cart</Button>
            <Button color="inherit" component={Link} to="/orders">Order History</Button>
            <Button color="inherit" onClick={onLogout}>Logout</Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">Login / Register</Button>
        )}
      </Box>
    </Toolbar>
  </AppBar>
);

export default Navbar;
