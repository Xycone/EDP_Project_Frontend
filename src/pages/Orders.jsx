import React, { useContext, useEffect, useState } from 'react';
import http from '../http';
import { Box, Typography, IconButton, Input, Button, Pagination, List, ListItem, ListItemText } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Delete, Search, Clear, Add } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import UserContext from '../contexts/UserContext';
import { Navigate, useNavigate } from 'react-router-dom';

function Orders() {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [search, setSearch] = useState('');
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const navigate = useNavigate();

    const handleCreateOrderClick = () => {
        // Navigate to the create order page
        navigate("/create-order");
    };

    const handleEditOrder = (orderId) => {
        navigate(`/edit-order/${orderId}`);
    };

    const columns = [
        { field: 'id', headerName: 'Order ID', flex: 0.3 },
        { field: 'userId', headerName: 'User ID', flex: 0.5 },
        { field: 'orderDate', headerName: 'Order Date', flex: 1 },
        { field: 'orderTotal', headerName: 'Order Total', flex: 0.8 },
        {
            field: 'edit',
            headerName: 'Edit',
            flex: 0.5,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditOrder(params.row.id)}
                >
                    Edit
                </Button>
            ),
        },
        // Add more columns as needed
    ];

    const handleDeleteConfirmationOpen = () => {
        // Show delete confirmation dialog only if there are selected orders
        if (selectedRows.length > 0) {
            setDeleteConfirmationOpen(true);
        }
    };

    const handleDeleteConfirmationClose = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleDelete = () => {
        // You can use the selectedRows state to get the selected order IDs
        for (const id of selectedRows) {
            http.delete(`/order/${id}`);
        }
        // After deletion, refresh the orders
        window.location.reload();
        // Clear selected user list after deletion
        setSelectedRows([]);

        setDeleteConfirmationOpen(false);
    };

    // API Calls
    const getOrders = () => {
        http.get(`/order?page=${page}&pageSize=${pageSize}&userId=${search}`)
            .then((res) => {
                console.log('Orders data:', res.data);
                setOrders(res.data);
            })
            .catch((error) => {
                console.error('Error fetching orders:', error);
            });
    };

    const handleSearch = () => {
        // Reset the page to 1 when performing a new search
        setPage(1);
        getOrders();
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        getOrders();
    };

    const handleSelectionChange = (selection) => {
        setSelectedRows(selection);
    };

    useEffect(() => {
        getOrders();
    }, [page, pageSize, search]); // Run once when the component mounts



    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Orders Page
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                }}
            >
                <Box>
                    <Input
                        placeholder="Search by User ID"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        sx={{
                            '& input::placeholder': {
                                fontSize: '0.8rem',
                            },
                        }}
                    />
                    <IconButton color="primary" onClick={handleSearch}>
                        <Search />
                    </IconButton>
                    <IconButton color="error" onClick={() => setSearch('')}>
                        <Clear />
                    </IconButton>

                </Box>
                <Button onClick={handleCreateOrderClick} sx={{ marginLeft: 'auto' }}>
                    <Add />
                </Button>
                <Button color="error" onClick={handleDeleteConfirmationOpen}>
                    <Delete />
                </Button>
            </Box>

            <Dialog open={deleteConfirmationOpen} onClose={handleDeleteConfirmationClose}>
                <DialogTitle>Delete Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the selected orders?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteConfirmationClose} color="inherit">
                        Cancel
                    </Button>

                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>




            <Box style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={orders}
                    columns={columns}
                    checkboxSelection
                    onRowSelectionModelChange={handleSelectionChange}
                    rowSelectionModel={selectedRows}
                    disableColumnMenu
                    disableRowSelectionOnClick
                    pagination
                    pageSize={pageSize}
                    rowCount={orders.length}
                    paginationMode="server"
                    onPageChange={(params) => handlePageChange(params.page)}
                    components={{
                        Pagination: Pagination,
                    }}
                    // Affects the font size of the data items
                    sx={{
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        padding: '16px',
                        fontSize: '0.6rem',
                    }}
                />
            </Box>
        </Box>
    );
}

export default Orders;
