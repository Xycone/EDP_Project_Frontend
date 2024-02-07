import { Box, Typography, TextField, Button, Grid, Card, CardContent, Link } from '@mui/material'
import React, { useEffect, useState } from 'react'
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AccountPage() {
    const [imageFile, setImageFile] = useState(null);
    const [user, setUser] = useState({
        userName: "",
        userEmail: "",
        userHp: "",
    });

    useEffect(() => {
        http.get(`/user/profile`).then((res) => {
            setUser(res.data);
            setImageFile(res.data.imageFile);
        });
    }, []);

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }
            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

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
            data.imageFile = imageFile
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
                        <Grid item xs={12} md={6} lg={6}>
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
                        <Grid item xs={12} md={6} lg={6}>
                            <CardContent>
                                <Box>
                                    <Box
                                        className="Profile"
                                        sx={{
                                            width: '200px',
                                            height: '200px',
                                            margin: '0 auto',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {
                                            // User set profile picture
                                            imageFile && (
                                                <img
                                                    alt="ProfileImage"
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        display: 'block',
                                                        borderRadius: '50%',
                                                    }}
                                                />
                                            )

                                        }
                                        {
                                            // Default profile picture if user did not set anything
                                            (!imageFile) && (
                                                <img
                                                    alt="DefaultProfileImage"
                                                    src={`${import.meta.env.VITE_DEFAULT_PROFILE_PICTURE_URL}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        display: 'block',
                                                        borderRadius: '50%',
                                                    }}
                                                />
                                            )

                                        }
                                    </Box>
                                    <Box sx={{ textAlign: 'center', mt: 3 }} >
                                        <Button variant="contained" component="label">
                                            Upload Image
                                            <input hidden accept="image/*" multiple type="file"
                                                onChange={onFileChange} />
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
            </Box >

            <ToastContainer />
        </Box >
    )
}
export default AccountPage