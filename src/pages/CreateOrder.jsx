import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function CreateOrders() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            userId: 0, // You may set the default value as needed
            orderDate: "",
            orderTotal: 0 // You may set the default value as needed
        },
        validationSchema: yup.object({
            userId: yup.number().required('User ID is required'),
            orderDate: yup.string().trim().required('Order Date is required'),
            orderTotal: yup.number().required('Order Total is required')
        }),
        onSubmit: (data) => {
            http.post("/order", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/orders");
                });
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Order
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="User ID"
                    name="userId"
                    type="number"
                    value={formik.values.userId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.userId && Boolean(formik.errors.userId)}
                    helperText={formik.touched.userId && formik.errors.userId}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    type="date"
                    label=""
                    name="orderDate"
                    value={formik.values.orderDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.orderDate && Boolean(formik.errors.orderDate)}
                    helperText={formik.touched.orderDate && formik.errors.orderDate}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Order Total"
                    name="orderTotal"
                    type="number"
                    value={formik.values.orderTotal}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.orderTotal && Boolean(formik.errors.orderTotal)}
                    helperText={formik.touched.orderTotal && formik.errors.orderTotal}
                />
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default CreateOrders;
