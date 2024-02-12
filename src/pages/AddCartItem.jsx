import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function AddCartItem() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      Name: '',
      quantity: '',
      price: '',
    },
    validationSchema: yup.object({
      Name: yup
        .string()
        .trim()
        .min(3, 'Item name must be at least 3 characters')
        .max(128, 'Item name must be at most 128 characters')
        .required('Item name is required'),
      quantity: yup
        .number()
        .min(1, 'Quantity must be at least 1')
        .required('Quantity is required'),
      price: yup
        .number()
        .min(0, 'Price must be at least 1')
        .required('Price is required'),
    }),
    onSubmit: (data) => {
      data.Name = data.Name;
      data.quantity = Number(data.quantity);
      data.price = Number(data.price);

      http
        .post('/cartitem/addcartitems', data)
        .then((res) => {
          console.log(res.data);
          navigate('/testCart'); // Update the route if needed
        })
        .catch((error) => {
            console.error('Error adding cart item:', error);
            if (error.response) {
              console.error('Response data:', error.response.data);
            }
          });
          
    },
  });

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Add Cart Item
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
                htmlFor="item-info-label"
              >
                Item Info
              </InputLabel>
              <TextField
                sx={{ my: 1, mt: 2, fontSize: '1rem' }}
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Item Name"
                name="Name"
                value={formik.values.Name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Name && Boolean(formik.errors.Name)}
                helperText={formik.touched.Name && formik.errors.Name}
              />
              <TextField
                sx={{ my: 1, fontSize: '1rem' }}
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Quantity"
                name="quantity"
                type="number"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                helperText={formik.touched.quantity && formik.errors.quantity}
              />
              <TextField
                sx={{ my: 1, fontSize: '1rem' }}
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Price"
                name="price"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                InputProps={{
                  startAdornment: '$',
                }}
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

export default AddCartItem;
