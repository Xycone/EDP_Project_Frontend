import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import http from '../http'; // Import your HTTP client library
import { DataGrid } from '@mui/x-data-grid';

function OrdersData() {
    const [orders, setOrders] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Fetch the user ID
        http.get('/user/auth')
            .then((res) => {
                setUserId(res.data.user.id); // Extract the ID from the user object
                console.log('User ID:', res.data.user.id);
            })
            .catch((error) => {
                console.error('Error fetching user ID:', error);
                // Handle error here, e.g., display an error message
            });
    }, []);

    useEffect(() => {
        // Fetch orders data only if userId is valid
        if (userId) {
            http.get(`/order?userId=${userId}`)
                .then((res) => {
                    setOrders(res.data);
                })
                .catch((error) => {
                    console.error('Error fetching orders:', error);
                    // Handle error here, e.g., display an error message
                });
        }
    }, [userId]); // Fetch orders whenever userId changes

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'activityName', headerName: 'Activity Name', flex: 1 },
        { field: 'quantity', headerName: 'Quantity', flex: 0.5 },
        { field: 'totalPrice', headerName: 'Total Price', flex: 0.5 },
        { field: 'orderDate', headerName: 'Order Date', flex: 1 },
    ];

    return (
        <Box sx={{ my: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Orders Data
            </Typography>
            <DataGrid
                rows={orders}
                columns={columns}
                disableColumnMenu
                disableRowSelectionOnClick
                hideFooter
                sx={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    padding: '16px',
                    fontSize: '0.8rem',
                }}
            />
        </Box>
    );
}

export default OrdersData;
