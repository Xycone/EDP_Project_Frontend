import { clear } from 'console';
import React from 'react';

function Success() {
    const clearCart = async () => {
        try {
            await http.delete('/cartitem');
            getCart();
        } catch (error) {
            console.error('Error clearing cart', error);
        }
    };
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
        clearCart()
    });
    return (
        <div>
            <h1>Payment Successful!</h1>
            <p>Thank you for your purchase. Your order has been successfully processed.</p>
            {/* You can add additional information or links here */}
        </div>
    );
};

export default Success;
