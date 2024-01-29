import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import http from '../http';
import { Box, Typography, Button } from '@mui/material'; // Add this line

const stripePromise = loadStripe('pk_test_51OdgVvEFMXlO8edaWWiNQmz7HT1mpULItw5vAF3BskfSB161pfYyHAm2WZ5rAqlCXKzUXFn7RbmNzpFOErGX0OZw00X9KvgJMJ');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    const response = await http.post('/payment', {
      amount: 1000, // Replace with actual amount
      paymentMethodId: paymentMethod.id,
    });

    if (response.data.success) {
      setCompleted(true);
      clearCart();
    }
  };

  if (completed) {
    return (
      <Box sx={{ my: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Thank you for your purchase!
        </Typography>
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Button type="submit" disabled={!stripe} sx={{ mt: 2 }}>
        Pay
      </Button>
    </form>
  );
}

export default CheckoutForm;