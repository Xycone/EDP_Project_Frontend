import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../http';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography, Checkbox, Button, Grid, Card, CardContent, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { loadStripe } from "@stripe/stripe-js";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Snackbar } from '@mui/material';
import dayjs from 'dayjs';
import global from '../global';


function TestCart() {
    // Items
    const [cartList, setCartList] = useState([]);
    const [voucherList, setVoucherList] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [itemIdToRemove, setItemIdToRemove] = useState(null);

    // Stripe
    const stripePromise = loadStripe("pk_test_51OdgVvEFMXlO8edaWWiNQmz7HT1mpULItw5vAF3BskfSB161pfYyHAm2WZ5rAqlCXKzUXFn7RbmNzpFOErGX0OZw00X9KvgJMJ");

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
        setSelectedVoucherId(null);
    }

    // Handle select all checkbox toggle
    const handleSelectAllToggle = (event) => {
        if (selectedItems.length > 0) {
            setSelectedItems([]);
            setSelectedVoucherId(null);
        }
        else {
            const unselectedItems = cartList.filter(cart => !selectedItems.includes(cart.id));
            setSelectedItems([...selectedItems, ...unselectedItems.map(cart => cart.id)]);
            setSelectedVoucherId(null);
        }
    }

    // Delete item from cart
    const handleDelete = async (id) => {
        await http.delete(`/cartitem/${id}`);

        getCart();

        setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    };

    // Delete items selected in cart
    const handleDeleteItemSelected = async () => {
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

    // Stripe
    const handleCheckout = async () => {
        const stripe = await stripePromise;

        // Filter cartList based on selectedItems array
        const selectedCartItems = cartList.filter(cartItem => selectedItems.includes(cartItem.id));

        try {
            console.log("Selected voucher ID:", selectedVoucherId);
            console.log("Cart items:", selectedCartItems);
            const requestData = {
                selectedCartItems: selectedCartItems,
                selectedVoucherId: selectedVoucherId
            };
            console.log(requestData);
            // Make POST request to backend endpoint with the cartList data
            const response = await http.post('/stripepayment/api/create-checkout-session', requestData);

            // Redirect to Stripe checkout page using the session ID returned from the backend
            await stripe.redirectToCheckout({
                sessionId: response.data.sessionId, // Assuming the backend returns the session ID in the response
            });
        } catch (error) {
            console.error('Error creating checkout session:', error);
            // Handle error
        }
    };


    useEffect(() => {
        getCart();
        getVouchers();
    }, []);

    // useEffect(() => {
    //     getCart();
    // }, [cartList]);

    // Scuffed front end total price calculation.
    const setTotalPrice = () => {
        let totalPrice = 0;

        selectedItems.forEach(selectedItemId => {
            const selectedItem = cartList.find(item => item.id === selectedItemId);

            if (selectedItem) {
                // Calculate price before discount
                let priceBeforeDiscount = selectedItem.price * selectedItem.quantity;

                // Add to total price
                totalPrice += priceBeforeDiscount;
            }
        });

        // Apply voucher discount if applicable
        if (selectedVoucherId !== null) {
            const voucher = voucherList.find(voucher => voucher.id === selectedVoucherId);
            if (voucher) {
                console.log(voucher);
                if (voucher.percentageDiscount === 0) {
                    totalPrice -= voucher.fixedDiscount;
                } else if (voucher.fixedDiscount === 0) {
                    totalPrice *= (1 - voucher.percentageDiscount / 100);
                }
            }
        }

        return totalPrice.toFixed(2);
    };

    const getTotalQty = () => {
        let totalQty = 0;

        selectedItems.forEach(selectedItemId => {
            const selectedItem = cartList.find(item => item.id === selectedItemId);

            if (selectedItem) {
                // Add to total qty
                totalQty += selectedItem.quantity;
            }
        });

        return totalQty;
    };

    const getTotalPrice = () => {
        let totalPrice = 0;

        selectedItems.forEach(selectedItemId => {
            const selectedItem = cartList.find(item => item.id === selectedItemId);

            if (selectedItem) {
                // Calculate price before discount
                let priceBeforeDiscount = selectedItem.price * selectedItem.quantity;

                // Add to total price
                totalPrice += priceBeforeDiscount;
            }
        });

        return totalPrice;
    };

    const isVoucherActive = (voucher) => {
        const totalPrice = getTotalPrice();
        const totalQty = getTotalQty();
        return totalPrice >= voucher.minSpend && totalQty >= voucher.minGroupSize;
    };

    const handleRemoveQuantity = (id, name, amount, price) => {
        amount -= 1;
        if (amount === 0) {
            setItemIdToRemove(id);
            setShowDialog(true);
        } else {
            const data = { name, quantity: amount, price };
            http.put(`/cartitem/${id}`, data)
                .then(() => {
                    // Update the cartList state with the updated quantity
                    setCartList(prevCartList => {
                        return prevCartList.map(item => {
                            if (item.id === id) {
                                return { ...item, quantity: amount };
                            } else {
                                return item;
                            }
                        });
                    });
                })
                .catch(error => {
                    console.error('Error updating quantity:', error);
                    // Handle error
                });
        }
    };

    const handleConfirmRemove = () => {
        handleDelete(itemIdToRemove);
        setShowDialog(false); // Hide dialog box after removal
    };

    const handleCancelRemove = () => {
        setShowDialog(false); // Hide dialog box
    };

    // Define state for controlling the popup
    const [showNotification, setShowNotification] = useState(false);

    // Define a function to handle closing the popup
    const handleCloseNotification = () => {
        setShowNotification(false);
    };

    const handleAddQuantity = (id, name, amount, price, activityId) => {
        // Fetch activity information to get availspots
        http.get(`/activity/${activityId}`)
            .then(response => {
                // Check if the response data is not null and contains the availSpots property
                if (response.data && response.data.availSpots !== undefined) {
                    const availspots = response.data.availSpots;
                    // Check if the updated quantity will exceed availspots
                    console.log(availspots);
                    if (amount < availspots) {
                        amount += 1;
                        const data = { name, quantity: amount, price };
                        http.put(`/cartitem/${id}`, data)
                            .then(() => {
                                // Update the cartList state with the updated quantity
                                setCartList(prevCartList => {
                                    return prevCartList.map(item => {
                                        if (item.id === id) {
                                            return { ...item, quantity: amount };
                                        } else {
                                            return item;
                                        }
                                    });
                                });
                            })
                            .catch(error => {
                                console.error('Error updating quantity:', error);
                                // Handle error
                            });
                    } else {
                        // Notify user that quantity cannot be increased above availspots
                        setShowNotification(true);
                    }
                } else {
                    console.error('Error: Invalid response data or missing availSpots property');
                    // Handle error or notify user about missing data
                }
            })
            .catch(error => {
                console.error('Error fetching activity information:', error);
                // Handle error
            });
    };




    return (
        <Box sx={{ my: 2 }}>
            {/* Popup notification */}
            <Snackbar
                open={showNotification}
                autoHideDuration={6000} // Adjust the duration as needed
                onClose={handleCloseNotification}
                message="Quantity cannot be increased above available spots."
            />
            <Typography variant="h6" sx={{ mb: 2, mr: 1 }}>
                My Cart
            </Typography>

            <Grid container spacing={4}>

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
                                        <Card sx={{ my: 1, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: isVoucherActive(voucher) ? '#fff' : '#f5f5f5', border: '1px solid #ddd', opacity: isVoucherActive(voucher) ? 1 : 0.5 }}>
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

                                                            <Typography sx={{ fontSize: '0.7rem', mt: 3}}>
                                                                Use by: <u>{dayjs(voucher.discountExpiry).format('DD/MM/YYYY')}</u>
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Grid>
                                                <Grid item xs={2} lg={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                                                    <Checkbox
                                                        checked={voucher.id === selectedVoucherId}
                                                        onChange={() => handleVoucherSelection(voucher.id)}
                                                        disabled={!isVoucherActive(voucher)}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                    {/* <Grid item xs={12} lg={12} sx={{ mt: 2 }}>
                        <Card>
                            <CardContent sx={{ backgroundColor: 'white', color: 'black' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <Typography sx={{ mb: 2, fontSize: '1rem' }}>
                                        Total Price: ${getTotalPrice()}
                                    </Typography>
                                    <Button variant="contained" onClick={checkoutSelectedItems}>
                                        Check out
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid> */}
                </Grid>

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
                                                <TableCell></TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell></TableCell>
                                                <TableCell>Total Price</TableCell>
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
                                                    <TableCell>
                                                        <Button onClick={() => handleRemoveQuantity(cart.id, cart.name, cart.quantity, cart.price)}>
                                                            <RemoveIcon />
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '0.8rem', textAlign: 'center' }}>
                                                        {cart.quantity}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button onClick={() => handleAddQuantity(cart.id, cart.name, cart.quantity, cart.price, cart.activityId)}>
                                                            <AddIcon />
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '0.8rem' }}>${cart.price * cart.quantity}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>

                                    </Table>
                                </TableContainer>
                            </Box>
                        </CardContent>
                        <Divider />
                        <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
                            <Typography sx={{ mr: 4, fontSize: '1rem' }}>
                                ({selectedItems.length}) selected
                            </Typography>
                            <Typography sx={{ mr: 4, fontSize: '1rem' }}>
                                <Link to="#" onClick={handleDeleteItemSelected} style={{ textDecoration: 'none', color: 'red', cursor: 'pointer' }}>
                                    Delete
                                </Link>
                            </Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <Typography sx={{ mr: 4 }}>
                                Total Price: ${setTotalPrice()}
                            </Typography>
                            <Button variant="contained" onClick={handleCheckout}>
                                Check out
                            </Button>
                        </Box>
                    </Card>
                </Grid>

            </Grid>
            {/* Dialog box */}
            <Dialog open={showDialog} onClose={handleCancelRemove}>
                <DialogTitle>Remove Item</DialogTitle>
                <DialogContent>
                    Are you sure you want to remove this item from your cart?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelRemove}>Cancel</Button>
                    <Button onClick={handleConfirmRemove} autoFocus>Remove</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default TestCart