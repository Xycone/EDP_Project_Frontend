import { Box, Button, Card, CardContent, Grid, Typography, TextField } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function ChangePassword() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },

        validationSchema: yup.object({
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required')
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                    "At least 1 letter and 1 number"),
            confirmPassword: yup.string().trim()
                .required('Confirm password is required')
                .oneOf([yup.ref('password')], 'Passwords must match'),
        }),

        onSubmit: (data) => {
            data.password = data.password.trim();
            console.log(data);
            http.put(`/user/update-password`, data)
                .then(() => {
                    navigate("/myAccount");
                });
        }
    });

    return (
        <Box sx={{ my: 2 }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Account Information
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Card>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12} lg={12}>
                            <CardContent sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
                                <Typography sx={{ my: 1, mt: 2, fontSize: '1rem' }}>
                                    Change account password
                                </Typography>
                            </CardContent>
                        </Grid>s
                        <Grid item xs={12} md={12} lg={12}>
                            <CardContent>
                                <Grid container spacing={1} alignItems="center">
                                    <Grid item xs={12} md={2.5} lg={2.5}>
                                        <Typography sx={{ margin: 1, mt: 2, fontSize: '1rem' }}>New Password:</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={9.5} lg={9.5}>
                                        <TextField
                                            margin="dense" autoComplete="off"
                                            name="password" type="password"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.password && Boolean(formik.errors.password)}
                                            helperText={formik.touched.password && formik.errors.password}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2.5} lg={2.5}>
                                        <Typography sx={{ margin: 1, mt: 2, fontSize: '1rem' }}>Confirm Password:</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={9.5} lg={9.5}>
                                        <TextField
                                            margin="dense" autoComplete="off"
                                            name="confirmPassword" type="password"
                                            value={formik.values.confirmPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.confirmPassword&& Boolean(formik.errors.confirmPassword)}
                                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant="contained" sx={{ mt: 7, my: 1, mr: 2 }} type="submit">
                                            Update Password
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </Box>
    )
}

export default ChangePassword