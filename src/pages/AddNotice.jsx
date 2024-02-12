import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function AddNotice() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: yup.object({
      name: yup
        .string()
        .trim()
        .min(3, 'Notice name must be at least 3 characters')
        .max(128, 'Notice name must be at most 128 characters')
        .required('Notice name is required'),
      description: yup
        .string()
        .trim()
        .min(3, 'Description must be at least 3 characters')
        .required('Description is required'),
    }),
    onSubmit: (data) => {
      http
        .post('/notice/addnotice', data)
        .then((res) => {
          console.log(res.data);
          navigate('/notices'); // Update the route if needed
        })
        .catch((error) => {
          console.error('Error adding notice:', error);
          if (error.response) {
            console.error('Response data:', error.response.data);
          }
        });
    },
  });

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Add Notice
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={8}>
            <Box
              sx={{
                mt: 1,
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                position: 'relative',
              }}
            >
              <TextField
                sx={{ my: 1, mt: 2, fontSize: '1rem' }}
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Notice Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <TextField
                sx={{ my: 1, fontSize: '1rem' }}
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Add
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AddNotice;
