import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, Button, Alert, CircularProgress, Box, Tabs, Tab } from '@mui/material';

const Login = ({ setIsLoggedIn, setUserId, setSnackbar }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Use form-based login for session authentication
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);
      await axios.post('/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true
      });
      setIsLoggedIn(true);
      setUserId(username);
      setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
      navigate('/products');
    } catch (err) {
      setError('Invalid credentials');
      setSnackbar({ open: true, message: 'Invalid credentials', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8080/api/auth/register', {
        username: regUsername,
        password: regPassword
      });
      setSnackbar({ open: true, message: 'Registration successful! Please log in.', severity: 'success' });
      setTab(0);
      setRegUsername('');
      setRegPassword('');
    } catch (err) {
      let msg = 'Registration failed. Try a different username.';
      if (err.response && err.response.data) {
        msg = typeof err.response.data === 'string' ? err.response.data : msg;
      }
      setError(msg);
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Card sx={{ minWidth: 350, maxWidth: 400 }}>
        <CardContent>
          <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(''); }} centered>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
          {tab === 0 && (
            <form onSubmit={handleLogin} style={{ marginTop: 16 }}>
              <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} fullWidth margin="normal" required autoFocus />
              <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth margin="normal" required />
              {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </form>
          )}
          {tab === 1 && (
            <form onSubmit={handleRegister} style={{ marginTop: 16 }}>
              <TextField label="Username" value={regUsername} onChange={e => setRegUsername(e.target.value)} fullWidth margin="normal" required autoFocus />
              <TextField label="Password" type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} fullWidth margin="normal" required />
              {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
