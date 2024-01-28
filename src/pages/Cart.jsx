import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../http';
import { Box, Typography, IconButton, Input, Button, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Delete, Search, Clear, AccessTime } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import global from '../global';

function Cart() {
    const [cartList, setCartList] = useState([]);
    const [open, setOpen] = useState(false);
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
        })
    };

    const clearCart = () => {
        http.delete('/cartitem').then((res) => {
            setCartList(res.data)

        })
    };


    useEffect(() => {
        getCart();
    }, []);

    return (
        <Box sx={{ my: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, mr: 1 }}>
                Manage Cart
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Link to="/checkout" style={{ textDecoration: 'none' }}>
                    <Button variant='contained'>
                        After purchase
                    </Button>
                </Link>

                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                    color="primary"
                    sx={{ padding: "4px" }}
                    onClick={() => handleOpen()}
                >
                    <Delete />
                </IconButton>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Clear cart</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to clear the cart?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="inherit"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => clearCart()}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Grid container spacing={2}>
                {cartList.map((cartitem) => (
                    <Grid item key={cartitem.id} xs={12} md={6} lg={4}>
                        <Link to={`/editcartitem/${cartitem.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Box
                                sx={{
                                    border: 1,
                                    borderColor: 'grey.300',
                                    borderRadius: 1,
                                    p: 2,
                                    flexGrow: 1,
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    transition: 'box-shadow 0.3s ease', // Add transition for smooth effect
                                    '&:hover': {
                                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)', // Adjust the shadow on hover
                                    },
                                }}
                            >
                                <Box sx={{ textAlign: 'center', borderBottom: '2px solid grey', pb: 1, }}>
                                    <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '1rem' }}>
                                        {cartitem.name}
                                    </Typography>
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    {/* Cart Item info */}
                                    <Typography variant="body1" sx={{ margin: 1, fontSize: '0.9rem' }}>
                                        Quantity:
                                    </Typography>
                                    <Typography variant="body2" sx={{ margin: 1, fontSize: '0.8rem' }}>
                                        {cartitem.quantity} booking(s)
                                    </Typography>
                                    <Typography variant="body1" sx={{ margin: 1, fontSize: '0.9rem' }}>
                                        Price:
                                    </Typography>
                                    <Typography variant="body2" sx={{ margin: 1, fontSize: '0.8rem' }}>
                                        ${cartitem.price}
                                    </Typography>
                                    <Typography variant="body1" sx={{ margin: 1, fontSize: '0.9rem' }}>
                                        Total price:
                                    </Typography>
                                    <Typography variant="body2" sx={{ margin: 1, fontSize: '0.8rem' }}>
                                        ${cartitem.price * cartitem.quantity}
                                    </Typography>
                                </Box>
                            </Box>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>


    )
}

export default Cart;