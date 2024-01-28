// Checkout.js

import React from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';

class Checkout extends React.Component {
  handleSubmit = async (e) => {
    e.preventDefault();

    const { token } = await this.props.stripe.createToken();

    // Send the token to your server to create a charge
    // You need to implement a server endpoint to handle the payment

    console.log('Token:', token);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Card details
          <CardElement />
        </label>
        <button type="submit">Pay</button>
      </form>
    );
  }
}

export default injectStripe(Checkout);
