import React, { useState } from 'react';
import { TextField, Button, Container } from '@mui/material';
import axios from 'axios';
import { login } from '../api/endpoint';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(login, {
        email,
        password
      });
      document.cookie = `access_token=${response.data['access_token']}; path=/`;
      navigate("/")
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
      setError("")
    }
  };

  return (

    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          sx={{ marginTop: '10px' }}
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {isLoading ? 'Loading...' : 'Sign In'}
        </Button>
      </form>
    </Container>
  );
};

export default LoginForm;