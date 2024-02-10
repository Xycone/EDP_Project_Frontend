import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../http';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography, Checkbox, Button, Grid, Paper, Card, CardContent, Divider } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function TestCart() {
    // Items
    const [cartList, setCartList] = useState([]);
    const [voucherList, setVoucherList] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);

    // API Calls
    // Retrieves Cart items
    const getCart = () => {
        http.get('/cartitem/getcartitems').then((res) => {
            setCartList(res.data);
        });
    };

    // Retrieves all of user's non expired vouchers
    const getVouchers = () => {
        http.get('/voucher/getMine').then((res) => {
            console.log(res.data);
            setVoucherList(res.data);
        });
    }


    // Handle individual checkbox toggle
    const handleItemToggle = (id) => {
        const selectedIndex = selectedItems.indexOf(id);
        let newSelected = [...selectedItems];

        // If the item is not currently in the selectedItems array, it is added to it.
        if (selectedIndex === -1) {
            newSelected.push(id);
        }
        // Otherwise, it is removed from the array
        else {
            newSelected.splice(selectedIndex, 1);
        }
        setSelectedItems(newSelected);
    }

    // Handle select all checkbox toggle
    const handleSelectAllToggle = (event) => {
        if (selectedItems.length > 0) {
            setSelectedItems([]);
        }
        else {
            const unselectedItems = cartList.filter(cart => !selectedItems.includes(cart.id));
            setSelectedItems([...selectedItems, ...unselectedItems.map(cart => cart.id)]);
        }
    }

    // Delete item from cart
    const handleDelete = async (id) => {
        await http.delete(`/cartitem/${id}`);

        getCart();

        setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    };

    // Delete items selected in cart
    const handleDeleteItemSelected = async() => {
        try {
            await Promise.all(selectedItems.map(async (itemId) => {
                await http.delete(`/cartitem/${itemId}`);
            }));

            getCart();

            setSelectedItems([]);
        } catch (error) {
            console.error('Error deleting selected items:', error);
        }
    };


    // Voucher Selection
    const handleVoucherSelection = (voucherId) => {
        setSelectedVoucherId(selectedVoucherId === voucherId ? null : voucherId);
    };

    // Test button
    const checkoutSelectedItems = () => {
        alert("Selected items: " + selectedItems.join(", "));
        alert("Applied vouchers: " + selectedVoucherId);
    }

    useEffect(() => {
        getCart();
        getVouchers();
    }, []);

    return (
        <Box sx={{ my: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, mr: 1 }}>
                My Cart
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} lg={7}>
                    <Card>

                        <CardContent sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
                            <Typography sx={{ my: 1, mt: 2, fontSize: '1rem' }}>
                                Cart Items
                            </Typography>
                        </CardContent>

                        <CardContent>
                            <Box style={{ height: 400, width: '100%' }}>
                                <TableContainer>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{
                                                    padding: 0.5,
                                                    '& .MuiTableCell-root': {
                                                        fontSize: '0.8rem',
                                                    }
                                                }}>
                                                    <Checkbox
                                                        checked={selectedItems.length === cartList.length && selectedItems.length != 0}
                                                        indeterminate={selectedItems.length > 0 && selectedItems.length < cartList.length}
                                                        onChange={handleSelectAllToggle}
                                                    />
                                                </TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Item Price</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={handleDeleteItemSelected} variant="outlined" color="error" size="small">
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cartList.map((cart) => (
                                                <TableRow key={cart.id}>
                                                    <TableCell sx={{
                                                        padding: 0.5,
                                                        '& .MuiTableCell-root': {
                                                            fontSize: '0.8rem',
                                                        }
                                                    }}>
                                                        <Checkbox
                                                            checked={selectedItems.includes(cart.id)}
                                                            onChange={() => handleItemToggle(cart.id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '0.8rem' }}>{cart.name}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.8rem' }}>${cart.price}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.8rem' }}>
                                                        {cart.quantity}
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '0.8rem' }}>
                                                        <Link to="#" onClick={() => handleDelete(cart.id)} style={{ textDecoration: 'none', color: 'red', cursor: 'pointer' }}>
                                                            Delete
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>

                                    </Table>
                                </TableContainer>
                            </Box>
                        </CardContent>
                        <Divider />
                        <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
                            <Box sx={{ flexGrow: 1 }} />
                            <Typography sx={{ mr: 4, fontSize: '1rem' }}>
                                Total Price: $2000
                            </Typography>
                            <Button variant="contained" onClick={checkoutSelectedItems}>
                                Check out
                            </Button>
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={5}>
                    <Card sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
                        <CardContent>
                            <Typography sx={{ my: 1, mt: 2, fontSize: '1rem' }}>
                                Your Vouchers
                            </Typography>
                        </CardContent>

                        <CardContent sx={{ backgroundColor: 'white', color: 'black' }}>
                            <Grid container spacing={2}>
                                {voucherList.map((voucher, index) => (
                                    <Grid item xs={12} md={6} lg={12} key={index}>
                                        <Card sx={{ my: 1, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#fff', border: '1px solid #ddd' }}>
                                            <Grid container>
                                                <Grid item xs={4} lg={4} sx={{ color: 'white', backgroundColor: '#E8533F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {voucher.minGroupSize < 2 &&
                                                        <Typography sx={{ padding: "3px", fontSize: "0.9rem", textAlign: "center" }}>
                                                            Gift Voucher
                                                        </Typography>
                                                    }
                                                    {voucher.minGroupSize >= 2 &&
                                                        <Typography sx={{ padding: "3px", fontSize: "0.9rem", textAlign: "center" }}>
                                                            Group Voucher
                                                        </Typography>
                                                    }

                                                </Grid>
                                                <Grid item xs={6} lg={6} sx={{ display: 'flex' }}>
                                                    <CardContent>
                                                        <Box sx={{ ml: "65px", padding: "3px" }}>
                                                            {voucher.percentageDiscount === 0 &&
                                                                <Typography sx={{ fontSize: '1rem' }}>${voucher.fixedDiscount} off</Typography>
                                                            }
                                                            {voucher.fixedDiscount === 0 &&
                                                                <Typography sx={{ fontSize: '1rem' }}>{voucher.percentageDiscount}% off</Typography>
                                                            }

                                                            <Typography sx={{ fontSize: '0.7rem' }}>Min Spend: ${voucher.minSpend}</Typography>

                                                            {voucher.minGroupSize < 2 &&
                                                                <Typography sx={{ fontSize: '0.7rem' }}>
                                                                    Grp Size: N/A
                                                                </Typography>
                                                            }
                                                            {voucher.minGroupSize >= 2 &&
                                                                <Typography sx={{ fontSize: '0.7rem' }}>Grp Size: {voucher.minGroupSize}</Typography>
                                                            }
                                                            <Typography sx={{ fontSize: '0.7rem' }}>Voucher Quantity: {voucher.voucherQuantity}</Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Grid>
                                                <Grid item xs={2} lg={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Checkbox
                                                        checked={voucher.id === selectedVoucherId}
                                                        onChange={() => handleVoucherSelection(voucher.id)}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>


        </Box>
    )
}

export default TestCart