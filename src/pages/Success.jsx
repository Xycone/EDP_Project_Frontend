import React, { useEffect, useState } from 'react';
import http from '../http';

function Success() {
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Extract URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const appliedVoucherParam = urlParams.get('appliedVoucher');
        const cartItemsParam = urlParams.get('cartItems');

        // Parse cart items JSON string
        const parsedCartItems = JSON.parse(decodeURIComponent(cartItemsParam));

        // Update state with extracted data
        setAppliedVoucher(appliedVoucherParam);
        setCartItems(parsedCartItems);
    }, []);

    // const clearCart = async () => {
    //     try {
    //         await http.delete('/cartitem');
    //         getCart();
    //     } catch (error) {
    //         console.error('Error clearing cart', error);
    //     }
    // };
    // const createOrder = async (data) => {
    //     try {
    //         http.post("/order", data)
    //             .then((res) => {
    //                 console.log(res.data);
    //             });
    //     } catch (error) {
    //         console.error('Error adding orders', error);
    //     }
    // };
    useEffect(() => {
        clearCart(); // Assuming clearCart is a function that clears the cart
    }, []);
    return (
        <div>
            <h1>Payment Successful!</h1>
            <p>Thank you for your purchase. Your order has been successfully processed.</p>
            {/* Display applied voucher */}
            <p>Applied Voucher: {appliedVoucher}</p>
            {/* Display cart items */}
            <ul>
                {cartItems.map((item, index) => (
                    <li key={index}>{item.Name} - Quantity: {item.Quantity}</li>
                ))}
            </ul>
            {/* You can add additional information or links here */}
        </div>
    );
};

export default Success;
