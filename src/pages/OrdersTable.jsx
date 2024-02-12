import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Input,
    Button,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import * as XLSX from 'xlsx'; // Import XLSX library

function OrdersTable() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        getOrders();
    }, [search]);

    const getOrders = () => {
        http.get(`/order?search=${search}`).then((res) => {
            setOrders(res.data);
        });
    };

    const handleSearch = () => {
        getOrders();
    };

    const handleClear = () => {
        setSearch('');
        getOrders();
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(orders);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, worksheet, 'Orders');
        XLSX.writeFile(wb, 'orders.xlsx');
    };

    const columns = [
        { field: 'id', headerName: 'Order ID', flex: 0.5 },
        { field: 'userId', headerName: 'User ID', flex: 0.5 },
        { field: 'orderDate', headerName: 'Order Date', flex: 0.8 },
        { field: 'totalPrice', headerName: 'Total Price', flex: 0.7 },

    ];

    return (
        <Box sx={{ my: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Orders Table
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input
                    value={search}
                    placeholder="Search by Order ID"
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                        '& input::placeholder': {
                            fontSize: '0.8rem',
                        },
                    }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                    <IconButton color="primary" onClick={handleSearch}>
                        <Search />
                    </IconButton>
                    <IconButton color="primary" onClick={handleClear}>
                        <Clear />
                    </IconButton>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Button color="primary" variant="contained" onClick={exportToExcel}>
                    Export to Excel
                </Button>
            </Box>
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

export default OrdersTable;



