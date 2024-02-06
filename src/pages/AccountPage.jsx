import { Box, Typography, TextField, Button, Grid, Card, CardContent, Link } from '@mui/material'
import React, { useEffect, useState } from 'react'
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';


function AccountPage() {
    const [user, setUser] = useState({
        userName: "",
        userEmail: "",
        userHp: "",
    });

    useEffect(() => {
        http.get(`/user/profile`).then((res) => {
            setUser(res.data);
        });
    }, []);

    const formik = useFormik({
        initialValues: user,
        enableReinitialize: true,
        validationSchema: yup.object({
            userName: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(50, 'Name must be at most 50 characters')
                .required('Name is required')
                .matches(/^[a-zA-Z '-,.]+$/,
                    "Only allow letters, spaces and characters: ' - , ."),
            userEmail: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            userHp: yup.string().trim()
                .required('Phone No is required')
                .matches(/^[0-9]+$/, 'Invalid phone number')
                .min(8, 'Singapore phone numbers only have 8 digits')
                .max(8, 'Singapore phone numbers only have 8 digits'),
        }),

        onSubmit: (data) => {
            data.userName = data.userName.trim();
            data.userEmail = data.userEmail.trim().toLowerCase();
            data.userHp = data.userHp.trim();
            http.put(`/user/update-profile`, data)
                .then(() => {
                    console.log(data);
                    window.location.reload(true);
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
                                    Manage and protect your account
                                </Typography>
                            </CardContent>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6}>
                            <CardContent>
                                <Grid container spacing={1} alignItems="center">
                                    <Grid item xs={12} md={3} lg={3}>
                                        <Typography sx={{ margin: 1, mt: 2, fontSize: '1rem' }}>Username:</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={9} lg={9}>
                                        <TextField
                                            margin="dense" autoComplete="off"
                                            name="userName"
                                            value={formik.values.userName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.userName && Boolean(formik.errors.userName)}
                                            helperText={formik.touched.userName && formik.errors.userName}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3} lg={3}>
                                        <Typography sx={{ margin: 1, mt: 2, fontSize: '1rem' }}>Email:</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={9} lg={9}>
                                        <TextField
                                            margin="dense" autoComplete="off"
                                            name="userEmail"
                                            value={formik.values.userEmail}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.userEmail && Boolean(formik.errors.userEmail)}
                                            helperText={formik.touched.userEmail && formik.errors.userEmail}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3} lg={3}>
                                        <Typography sx={{ margin: 1, mt: 2, fontSize: '1rem' }}>Password:</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={9} lg={9}>
                                        <Typography sx={{ margin: 1, mt: 2, fontSize: '1rem' }}><Link to="/change-password">Change Password</Link></Typography>
                                    </Grid>
                                    <Grid item xs={12} md={3} lg={3}>
                                        <Typography sx={{ margin: 1, mt: 2, fontSize: '1rem' }}>Phone:</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={9} lg={9}>
                                        <TextField
                                            margin="dense" autoComplete="off"
                                            name="userHp"
                                            value={formik.values.userHp}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.userHp && Boolean(formik.errors.userHp)}
                                            helperText={formik.touched.userHp && formik.errors.userHp}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant="contained" sx={{ mt: 7 }} type="submit" >
                                            Save Changes
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6}>
                            <CardContent>
                                
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
            </Box >
        </Box >
    )
}
export default AccountPage