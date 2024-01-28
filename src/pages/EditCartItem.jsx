import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditCartItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cartItem, setCartItem] = useState({
    name: "",
    quantity: "",
    price: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get(`/cartitem/${id}`).then((res) => {
      setCartItem(res.data);
      setLoading(false);
    });
  }, []);

  const formik = useFormik({
    initialValues: cartItem,
    enableReinitialize: true,
    validationSchema: yup.object({
      name: yup.string().trim()
        .min(3, 'Item name must be at least 3 characters')
        .max(128, 'Item name must be at most 128 characters')
        .required('Item name is required'),
      quantity: yup.number()
        .min(1, 'Quantity must be at least 1')
        .required('Quantity is required'),
      price: yup.number()
        .min(0.01, 'Price must be at least 0.01')
        .required('Price is required'),
    }),
    onSubmit: (data) => {
      data.name = data.name.trim();
      data.quantity = Number(data.quantity);
      data.price = Number(data.price);
      http.put(`/cartitem/${id}`, data)
        .then((res) => {
          console.log(res.data);
          navigate("/cart");
        });
    }
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteCartItem = () => {
    http.delete(`/cartitem/${id}`)
      .then((res) => {
        console.log(res.data);
        navigate("/cart");
      });
  }

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Edit Cart Item
      </Typography>
      {
        !loading && (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Box sx={{ mt: 1, border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '16px', position: 'relative' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                Cart Item Info
              </Typography>
              <TextField
                sx={{ my: 1, fontSize: '1rem' }}
                fullWidth
                margin="dense"
                autoComplete="off"
                label="name"
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
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Button variant="contained" type="submit">
                Update
              </Button>
              <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={handleOpen}>
                Delete
              </Button>
            </Box>
          </Box>
        )
      }

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Delete Cart Item
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this cart item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={deleteCartItem}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EditCartItem;
