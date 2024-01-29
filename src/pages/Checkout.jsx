import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import http from '../http';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_51OdgVvEFMXlO8edaWWiNQmz7HT1mpULItw5vAF3BskfSB161pfYyHAm2WZ5rAqlCXKzUXFn7RbmNzpFOErGX0OZw00X9KvgJMJ');

function Checkout() {
  return (
    <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Typography variant="h6" sx={{ marginTop: '20px' }}>
        Checkout
      </Typography>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
      <Link to="/cart" style={{ textDecoration: 'none', marginTop: '20px' }}>
        <Button color="primary">
          Back to Cart
        </Button>
      </Link>
    </Box>
  );
}

export default Checkout;
