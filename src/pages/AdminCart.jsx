import React, { useEffect, useState } from 'react';
import http from '../http';
import { Box, Typography, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ActivityPopularityChart from './ActivityPopularityChart';

function AdminCart() {
    const [cartList, setCartList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({ labels: [], values: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await http.get('/cartitem/GetAllCartItems');
                setCartList(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                // Handle error
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Process cartList to aggregate quantities by name
        const activityPopularity = cartList.reduce((accumulator, currentValue) => {
            const { name, quantity } = currentValue;
            accumulator[name] = (accumulator[name] || 0) + quantity;
            return accumulator;
        }, {});

        // Convert activityPopularity object into array of objects for chart data
        const labels = Object.keys(activityPopularity);
        const values = Object.values(activityPopularity);

        // Sort labels and values in descending order
        const sortedLabels = labels.sort((a, b) => activityPopularity[b] - activityPopularity[a]);
        const sortedValues = sortedLabels.map(label => activityPopularity[label]);

        setChartData({
            labels: sortedLabels,
            values: sortedValues,
        });
    }, [cartList]);

    const columns = [
        { field: 'name', headerName: 'Name', flex: 2 },
        { field: 'quantity', headerName: 'Quantity', flex: 0.5 },
        { field: 'price', headerName: 'Price', flex: 0.5 },
        { field: 'userId', headerName: 'User ID', flex: 1 },
        { field: 'activityId', headerName: 'Activity ID', flex: 1 },
    ];

    const rows = cartList.map((cartItem) => ({
        id: cartItem.id,
        name: cartItem.name,
        quantity: cartItem.quantity,
        price: `$${cartItem.price.toFixed(2)}`,
        userId: cartItem.userId,
        activityId: cartItem.activityId,
    }));

    return (
        <Box sx={{ my: 2 }}>
            <Grid container direction="column" alignItems="flex-start">
                <Typography variant="h6" sx={{ mb: 2, ml: 2 }}>
                    Manage Cart
                </Typography>
                <Grid item xs={12} sx={{ width: '100%', mt: 4 }}>
                    <ActivityPopularityChart data={chartData} />
                </Grid>
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        cellClassName="center-align"
                        headerClassName="center-align"
                        hideFooter
                        loading={loading}
                        sx={{ width: '100%' }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default AdminCart;
