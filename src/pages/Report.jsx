import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
} from '@mui/material';
import http from '../http';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

function Report() {
    const [orders, setOrders] = useState([]);
    const [totalPrices, setTotalPrices] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        // Fetch orders data when component mounts
        fetchOrders();
    }, []);

    useEffect(() => {
        // Calculate total prices and total orders when orders change
        calculateTotalPrices();
        calculateTotalOrders();
        lastsixmonths();
    }, [orders]);

    const fetchOrders = async () => {
        try {
            const response = await http.get('/order');
            const ordersWithMonth = response.data.map(order => {
                // Extract the month from the OrderDate
                const orderMonth = new Date(order.OrderDate).getMonth();
                return { ...order, orderMonth };
            });
            setOrders(ordersWithMonth);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };


    const calculateTotalPrices = () => {
        const total = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        setTotalPrices(total);
    };

    const calculateTotalOrders = () => {
        const total = orders.length;
        setTotalOrders(total);
    };

    const lastsixmonths = () => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentMonth = new Date().getMonth();

        // Calculate the starting index for the last six months
        const startIndex = currentMonth >= 5 ? currentMonth - 5 : 12 + currentMonth - 5;

        // Create a sublist of the last six months
        const lastSixMonths = months.slice(startIndex).concat(months.slice(0, currentMonth + 1));

        return lastSixMonths;
    };

    return (
        <Box>
            <Typography style={{ margin: '2%' }} variant="h4">Order Report</Typography>
            <Typography variant="h5">
                Total Prices: <span style={{ fontWeight: 'bold' }}>${totalPrices}</span>
                <span style={{ marginLeft: '60%' }}>Total Orders: <span style={{ fontWeight: 'bold' }}>{totalOrders}</span></span>
            </Typography>
            <Typography>Last Six Months: {lastsixmonths().join(', ')}</Typography>
            <Grid container justifyContent="center" sx={{ marginTop: '2rem' }}>
                <Grid item>
                    {/* Use Link from React Router to navigate to OrdersTable */}
                    <Link to="/orders" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" color="primary">
                            View Orders
                        </Button>
                    </Link>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Report;

