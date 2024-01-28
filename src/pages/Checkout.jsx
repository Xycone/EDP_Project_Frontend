// Checkout.js

import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import http from '../http';

function Checkout() {
    const clearCart = () => {
        http.delete('/cartitem').then((res) => {
        })
    };
    useEffect(() => {
        clearCart();
      }, []);
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Imagine this is after purchase
        Thank you for your purchase crap
      </Typography>
      <Link to="/cart" style={{ textDecoration: 'none' }}>
        <Button variant="contained" color="primary">
          Back to Cart
        </Button>
      </Link>
    </Box>
  );
}

export default Checkout;
