// EditOrder.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../http';
import { Box, Typography, Button, TextField } from '@mui/material';

function EditOrder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState({
        // Initialize with default values or an empty state structure
        id: '',
        userId: '',
        orderDate: '',
        orderTotal: '',
        // Add more fields as needed
    });

    useEffect(() => {
        // Fetch order details based on the ID when the component mounts
        http.get(`/order/${id}`)
            .then((res) => {
                setOrder(res.data);
            })
            .catch((error) => {
                console.error('Error fetching order details:', error);
                // Handle error as needed
            });
    }, [id]);

    const handleSaveChanges = () => {
        // Implement logic to save changes to the order
        // You can use the http.put or http.patch method depending on your API
        // Make sure to update the API endpoint and request body according to your needs
        http.put(`/order/${id}`, order)
            .then((res) => {
                console.log('Order updated successfully:', res.data);
                // Handle success as needed
                navigate('/orders');
            })
            .catch((error) => {
                console.error('Error updating order:', error);
                // Handle error as needed
            });
    };

    // You can customize the UI and layout based on your requirements
    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Edit Order
            </Typography>
            <TextField
                label="Order ID"
                value={order.id}
                disabled
                fullWidth
                sx={{ mb: 2 }}
            />
            <TextField
                label="User ID"
                value={order.userId}
                onChange={(e) => setOrder({ ...order, userId: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
            />
            <TextField
                label="Order Date"
                value={order.orderDate}
                onChange={(e) => setOrder({ ...order, orderDate: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
            />
            <TextField
                label="Order Total"
                value={order.orderTotal}
                onChange={(e) => setOrder({ ...order, orderTotal: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
            />
            {/* Add more fields as needed */}

            <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                Save Changes
            </Button>
        </Box>
    );
}

export default EditOrder;
