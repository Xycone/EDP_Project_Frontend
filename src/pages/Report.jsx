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
import { Link } from 'react-router-dom';
import ReportChart from './ReportChart'; // Import the ReportChart component

function Report() {
    const [orders, setOrders] = useState([]);
    const [totalPrices, setTotalPrices] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [chartData, setChartData] = useState({ labels: [], values: [] }); // Initialize chart data state

    useEffect(() => {
        // Fetch orders data when component mounts
        fetchOrders();
    }, []);

    useEffect(() => {
        // Calculate total prices and total orders when orders change
        calculateTotalPrices();
        calculateTotalOrders();
        generateChartData(); // Generate chart data
    }, [orders]);

    const fetchOrders = async () => {
        try {
            const response = await http.get('/order');
            console.log('Orders data:', response.data); // Log the entire orders data

            const ordersWithMonth = response.data.map(order => {
                console.log(`Order Date: ${order.orderDate}`); // Log the order date
                const orderMonth = new Date(order.orderDate).getMonth() + 1; // Add 1 to get the month index starting from 1
                console.log(`Order month: ${orderMonth}`); // Log the month of each order
                return { ...order, orderMonth };
            });
            setOrders(ordersWithMonth);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const calculateTotalPrices = () => {
        const total = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        console.log(`Total Prices: ${total}`); // Log the total prices
        setTotalPrices(total);
    };

    const calculateTotalOrders = () => {
        const total = orders.length;
        console.log(`Total Orders: ${total}`); // Log the total orders
        setTotalOrders(total);
    };

    const generateChartData = () => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const salesByMonth = Array.from({ length: 12 }, () => 0); // Initialize with zeros

        orders.forEach(order => {
            const orderDate = new Date(order.orderDate);
            const monthIndex = orderDate.getMonth();
            salesByMonth[monthIndex] += order.totalPrice;
        });

        // Calculate starting and ending month indices based on current month
        const currentMonth = new Date().getMonth();
        const startMonth = currentMonth;
        const endMonth = (currentMonth - 6 + 12) % 12; // Handle wrapping around to previous year

        // Extract the desired 6 months using a single slice
        let labels = [];
        let values = [];

        for (let i = startMonth; i !== endMonth; i = (i - 1 + 12) % 12) {
            labels.push(months[i]);
            values.push(salesByMonth[i]);
        }
        labels.push(months[endMonth]); // Include the last month in the range

        console.log('Chart Data:', { labels, values });
        setChartData({ labels, values });
    };

    return (
        <Box>
            <Typography style={{ margin: '2%' }} variant="h4">Order Report</Typography>
            <Typography variant="h5">
                Total Prices: <span style={{ fontWeight: 'bold' }}>${totalPrices}</span>
                <span style={{ marginLeft: '60%' }}>Total Orders: <span style={{ fontWeight: 'bold' }}>{totalOrders}</span></span>
            </Typography>
            <ReportChart data={chartData} /> {/* Pass chart data to the ReportChart component */}
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


