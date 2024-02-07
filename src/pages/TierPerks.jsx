import React, { useState, useEffect } from 'react';
import http from '../http';
import { Box, Typography, Grid, InputLabel, Button, Card, CardContent, FormControl, Select, MenuItem, TextField, IconButton } from '@mui/material';
import { AccessTime, Add, Delete } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import global from '../global';

function TierPerks() {
    const { id } = useParams();
    const [tier, setTier] = useState({
        tierName: "",
        tierBookings: "",
        tierSpendings: "",
        tierPosition: "",
    });
    const [perkList, setPerkList] = useState([]);

    // API Calls
    const getTier = () => {
        http.get(`/tier/${id}`).then((res) => {
            setTier(res.data);
        });
    }
    const getPerks = () => {
        http.get(`/perk/${id}`).then((res) => {
            setPerkList(res.data);
        })
    };

    const handleDeletePerk = (perkId) => {
        http.delete(`/perk/${perkId}`).then((res) => {
            getPerks();
        })
    };


    const [discountType, setDiscountType] = useState('fixed');
    // used to decide if the perk form shd be displayed
    const [showPerkForm, setShowPerkForm] = useState(false);

    const handlePerkFormOpen = () => {
        setShowPerkForm(true);
    };

    // used to cancel the perk form and hide it when clicked
    const handlePerkCancel = () => {
        formik.resetForm();
        setDiscountType('fixed');
        setShowPerkForm(false);
    };

    const formik = useFormik({
        initialValues: {
            percentageDiscount: '',
            fixedDiscount: '',
            minGroupSize: '',
            minSpend: '',
            voucherQuantity: '',
            tierId: ''
        },
        validationSchema: yup.object({
            percentageDiscount: yup
                .number()
                .min(0, 'Percentage Discount must be >= to 0')
                .max(100, 'Percentage Discount must be <= to 100'),
            fixedDiscount: yup
                .number()
                .integer('Value must be an integer')
                .min(0, 'Fixed Discount must be greater than or equal to 0'),
            minGroupSize: yup
                .number()
                .integer('Value must be an integer')
                .min(1, 'Min Grp Size must be >= to 1')
                .required('Min Grp Size is required'),
            minSpend: yup
                .number()
                .min(0, 'Minimum Spend must be >= to 0')
                .required('Min Spend is required'),
            voucherQuantity: yup
                .number()
                .integer('Value must be an integer')
                .min(1, 'Qty must be >= to 1')
                .required('Qty is required'),
        }),
        onSubmit: (data, { resetForm }) => {
            // Resets the opposite fields based on the selected discount type
            // Prevents submission of both percentage discount and fixed discount tgt
            // which would otherwise cause the API to not go through
            if (discountType === 'percentage') {
                formik.setFieldValue('fixedDiscount', 0);
            } else if (discountType === 'fixed') {
                formik.setFieldValue('percentageDiscount', 0)
            }
            data.percentageDiscount = Number(data.percentageDiscount);
            data.fixedDiscount = Number(data.fixedDiscount);
            data.minGroupSize = Number(data.minGroupSize);
            data.minSpend = Number(data.minSpend);
            data.voucherQuantity = Number(data.voucherQuantity);
            data.tierId = id;
            console.log('Form Data:', data);
            console.log('Formik Values:', formik.values);

            http.post("/perk", data).then((res) => {
                console.log('API Response:', res);
                // Resets the form and discountType dropdown state
                resetForm({
                    values: {
                        percentageDiscount: '',
                        fixedDiscount: '',
                        minGroupSize: '',
                        minSpend: '',
                        voucherQuantity: '',
                        tierId: id,
                    },
                });
                setDiscountType('fixed');

                setShowPerkForm(false)
                window.location.reload(true)
            });
        }
    });

    useEffect(() => {
        getTier();
        getPerks();
    }, []);

    return (
        <Box sx={{ my: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, mr: 1 }}>
                {tier.tierName} tier perks
            </Typography>
            <Box sx={{ mt: 1, border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '16px', position: 'relative' }}>
                <InputLabel
                    sx={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        transform: 'translate(8px, -50%)',
                        background: 'white',
                        padding: '0 4px',
                        fontSize: '0.8rem',
                        color: '#555',
                    }}
                    htmlFor="tier-info-label"
                >
                </InputLabel>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={5} lg={6} sx={{ textAlign: 'center' }}>
                        <Typography sx={{ my: 1, mt: 2, fontSize: '1rem' }}>
                            Tier Name: {tier.tierName}
                        </Typography>
                        <Typography sx={{ my: 1, fontSize: '1rem' }}>
                            Booking Requirements: {tier.tierBookings}
                        </Typography>
                        <Typography sx={{ my: 1, fontSize: '1rem' }}>
                            Spending Requirements: {tier.tierSpendings}
                        </Typography>
                        <Typography sx={{ my: 1, fontSize: '1rem' }}>
                            Tier Position: {tier.tierPosition}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ my: 1, mr: 1, fontSize: '1rem' }}>
                                Last Updated: 
                            </Typography>
                            <AccessTime sx={{ mr: 0.5, fontSize: '1rem' }} />
                            <Typography sx={{ my: 1, fontSize: '1rem' }}>
                                {dayjs().format(global.datetimeFormat)}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={7} lg={6}>
                        <Box sx={{ mt: 1, border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '16px', position: 'relative' }}>
                            <InputLabel
                                sx={{
                                    position: 'absolute',
                                    top: '0',
                                    left: '0',
                                    transform: 'translate(8px, -50%)',
                                    background: 'white',
                                    padding: '0 4px',
                                    fontSize: '0.8rem',
                                    color: '#555',
                                }}
                                htmlFor="tier-info-label"
                            >
                                Tier Perks
                            </InputLabel>
                            <Box sx={{ my: 2 }}>
                                {perkList.map((perk, index) => (
                                    <Card key={index} sx={{ my: 1, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#fff', border: '1px solid #ddd' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={3} md={3} lg={3} sx={{ color: 'white', backgroundColor: '#E8533F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {perk.minGroupSize < 2 &&
                                                    <Typography sx={{ padding: "3px", fontSize: "0.8rem", textAlign: "center" }}>
                                                        Gift Voucher
                                                    </Typography>
                                                }
                                                {perk.minGroupSize >= 2 &&
                                                    <Typography sx={{ padding: "3px", fontSize: "0.8rem", textAlign: "center" }}>
                                                        Group Voucher
                                                    </Typography>
                                                }

                                            </Grid>
                                            <Grid item xs={7} md={7} lg={7} sx={{ display: 'flex' }}>
                                                <CardContent>
                                                    <Box sx={{ ml: "65px", padding: "3px" }}>
                                                        {perk.percentageDiscount === 0 &&
                                                            <Typography sx={{ fontSize: "1rem" }}>${perk.fixedDiscount} off</Typography>
                                                        }
                                                        {perk.fixedDiscount === 0 &&
                                                            <Typography sx={{ fontSize: "1rem" }}>{perk.percentageDiscount}% off</Typography>
                                                        }

                                                        <Typography sx={{ fontSize: "0.7rem" }}>Min Spend: ${perk.minSpend}</Typography>

                                                        {perk.minGroupSize < 2 &&
                                                            <Typography sx={{ fontSize: "0.7rem" }}>
                                                                Grp Size: N/A
                                                            </Typography>
                                                        }
                                                        {perk.minGroupSize >= 2 &&
                                                            <Typography sx={{ fontSize: "0.7rem" }}>Grp Size: {perk.minGroupSize}</Typography>
                                                        }

                                                        <Typography sx={{ fontSize: "0.7rem" }}>Credited x{perk.voucherQuantity} a month</Typography>
                                                    </Box>
                                                </CardContent>
                                            </Grid>
                                            <Grid item xs={2} md={2} lg={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <IconButton onClick={() => handleDeletePerk(perk.id)} variant="outlined" color="error" size="small" sx={{ mt: 1 }}>
                                                    <Delete />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                ))}
                            </Box>

                            {!showPerkForm && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ flexGrow: 1 }} />
                                    <Button fullWidth onClick={handlePerkFormOpen} sx={{ color: 'inherit', border: '2px dotted #000' }}>
                                        <Add />
                                    </Button>
                                </Box>
                            )}

                            {showPerkForm && (
                                <Card sx={{ my: 1, borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#fff', border: '1px solid #ddd' }}>
                                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ padding: 2 }}>
                                        <FormControl fullWidth sx={{ my: 1 }}>
                                            <Select
                                                sx={{ fontSize: '1rem' }}
                                                fullWidth name="discountType"
                                                value={discountType}
                                                onChange={(e) => setDiscountType(e.target.value)}
                                                size="small"
                                            >
                                                <MenuItem value="fixed">fixed discount ($)</MenuItem>
                                                <MenuItem value="percentage">percentage discount (%)</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <Grid container spacing={2}>
                                            <Grid item xs={8} md={8} lg={8}>
                                                {discountType === "fixed" && (
                                                    <TextField
                                                        sx={{ my: 1, fontSize: '1rem' }}
                                                        fullWidth margin="dense" autoComplete="off"
                                                        label="Fixed Discount"
                                                        name="fixedDiscount"
                                                        value={formik.values.fixedDiscount}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={formik.touched.fixedDiscount && Boolean(formik.errors.fixedDiscount)}
                                                        helperText={formik.touched.fixedDiscount && formik.errors.fixedDiscount}
                                                        InputProps={{
                                                            startAdornment: "$",
                                                        }}
                                                        size="small"
                                                    />
                                                )}
                                                {discountType === "percentage" && (
                                                    <TextField
                                                        sx={{ my: 1, fontSize: '1rem' }}
                                                        fullWidth margin="dense" autoComplete="off"
                                                        label="Percentage Discount"
                                                        name="percentageDiscount"
                                                        value={formik.values.percentageDiscount}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={formik.touched.percentageDiscount && Boolean(formik.errors.percentageDiscount)}
                                                        helperText={formik.touched.percentageDiscount && formik.errors.percentageDiscount}
                                                        InputProps={{
                                                            endAdornment: "%",
                                                        }}
                                                        size="small"
                                                    />
                                                )}
                                            </Grid>
                                            <Grid item xs={4} md={4} lg={4}>
                                                <TextField
                                                    sx={{ my: 1, fontSize: '1rem' }}
                                                    fullWidth margin="dense" autoComplete="off"
                                                    label="Voucher Qty"
                                                    name="voucherQuantity"
                                                    type="number"
                                                    value={formik.values.voucherQuantity}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.voucherQuantity && Boolean(formik.errors.voucherQuantity)}
                                                    helperText={formik.touched.voucherQuantity && formik.errors.voucherQuantity}
                                                    size="small"
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={2}>
                                            <Grid item xs={6} md={6} lg={6}>
                                                <TextField
                                                    sx={{ my: 1, fontSize: '1rem' }}
                                                    fullWidth margin="dense" autoComplete="off"
                                                    label="Min Spend"
                                                    name="minSpend"
                                                    value={formik.values.minSpend}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.minSpend && Boolean(formik.errors.minSpend)}
                                                    helperText={formik.touched.minSpend && formik.errors.minSpend}
                                                    InputProps={{
                                                        startAdornment: "$",
                                                    }}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={6} lg={6}>
                                                <TextField
                                                    sx={{ my: 1, fontSize: '1rem' }}
                                                    fullWidth margin="dense" autoComplete="off"
                                                    label="Min Grp Size"
                                                    name="minGroupSize"
                                                    type="number"
                                                    value={formik.values.minGroupSize}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.minGroupSize && Boolean(formik.errors.minGroupSize)}
                                                    helperText={formik.touched.minGroupSize && formik.errors.minGroupSize}
                                                    size="small"
                                                />
                                            </Grid>
                                        </Grid>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Box sx={{ flexGrow: 1 }} />
                                            <Button variant='contained' type="submit" size="small" color="secondary" sx={{ my: 1, mr: 2 }}>
                                                Save
                                            </Button>
                                            <Button variant='contained' type="submit" size="small" onClick={handlePerkCancel} color='error' sx={{ my: 1 }}>
                                                Cancel
                                            </Button>
                                        </Box>
                                    </Box>
                                </Card>
                            )}


                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>

    )
}

export default TierPerks