import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../http';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { loadStripe } from "@stripe/stripe-js"; // Import Stripe package

function Cart() {
    const [cartList, setCartList] = useState([]);
    const [open, setOpen] = useState(false);
    const stripePromise = loadStripe("pk_test_51OdgVvEFMXlO8edaWWiNQmz7HT1mpULItw5vAF3BskfSB161pfYyHAm2WZ5rAqlCXKzUXFn7RbmNzpFOErGX0OZw00X9KvgJMJ"); // Replace YourPublicKey with your actual Stripe public key
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // API Calls
    const getCart = () => {
        http.get('/cartitem/getcartitems').then((res) => {
            setCartList(res.data);
        });
    };

    const handleCheckout = async () => {
        const stripe = await stripePromise;
    
        // Convert cartList to an array of cart items
        const formattedCartList = cartList.map(cartItem => ({
            name: cartItem.name,
            quantity: cartItem.quantity,
            price: cartItem.price, // No need to multiply by 100, as Stripe expects amount in cents only for the unit amount
        }));
    
        try {
            console.log(formattedCartList);
            // Make POST request to backend endpoint with the cartList data
            const response = await http.post('/stripepayment/api/create-checkout-session', formattedCartList);
    
            // Redirect to Stripe checkout page using the session ID returned from the backend
            await stripe.redirectToCheckout({
                sessionId: response.data.sessionId, // Assuming the backend returns the session ID in the response
            });
        } catch (error) {
            console.error('Error creating checkout session:', error);
            // Handle error
        }
    };
    

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    
        if (confirmDelete) {
            await http.delete(`/cartitem/${id}`);
            getCart();
        }
    };

    const clearCart = async () => {
        try {
            await http.delete('/cartitem');
            getCart();
        } catch (error) {
            console.error('Error clearing cart', error);
        }
    };

    useEffect(() => {
        getCart();
    }, []);

    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'quantity', headerName: 'Quantity', flex: 0.5 },
        { field: 'price', headerName: 'Price', flex: 0.5 },
        { field: 'totalPrice', headerName: 'Total Price', flex: 0.5,
            valueFormatter: (params) => `$${params.value.toFixed(2)}` // Format total price with a dollar sign
        },
        {
            field: 'edit',
            headerName: 'Manage quantity',
            flex: 0.5,
            renderCell: (params) => (
                <Link to={`/editcartitem/${params.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <IconButton color="primary">
                        <Edit />
                    </IconButton>
                </Link>
            ),
        },
        {
            field: 'delete',
            headerName: 'Remove',
            flex: 0.5,
            renderCell: (params) => (
                <IconButton color="error" onClick={() => handleDelete(params.id)}>
                    <Delete />
                </IconButton>
            ),
        },
    ];

    const rows = cartList.map((cartitem) => ({
        id: cartitem.id,
        name: cartitem.name,
        quantity: cartitem.quantity,
        price: `$${cartitem.price.toFixed(2)}`, // Format price with a dollar sign
        totalPrice: cartitem.price * cartitem.quantity, // Calculate total price without formatting
    }));

    const totalCartPrice = rows.reduce((total, row) => total + row.totalPrice, 0); // Calculate total price

    return (
        <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '90%' }}>
                <Typography variant="h6">
                    Manage Cart
                </Typography>
                <Button variant="contained" color="error" onClick={handleOpen}>
                    Clear Cart
                </Button>
            </Box>

            <Box sx={{ mb: 2, width: '90%', marginTop: '20px' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    cellClassName="center-align"
                    headerClassName="center-align"
                    hideFooter
                />
            </Box>

            <Box sx={{ width: '90%', display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Typography variant="body1">
                    Total Price: ${totalCartPrice.toFixed(2)}
                </Typography>
            </Box>

            <Box sx={{ width: '90%', display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Button variant="contained" color="primary" onClick={handleCheckout}>
                    Checkout
                </Button>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Clear cart</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to clear the cart?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={() => { clearCart(); handleClose(); }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Cart;
