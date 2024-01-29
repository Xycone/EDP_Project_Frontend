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
    initialValues: {
      quantity: cartItem.quantity,
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      quantity: yup.number()
        .min(1, 'Quantity must be at least 1')
        .required('Quantity is required'),
    }),
    onSubmit: (data) => {
      data.name = cartItem.name;
      data.price = cartItem.price;
      data.quantity = Number(data.quantity);

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
              <Typography variant="body1" sx={{ my: 1 }}>
                Name: {cartItem.name}
              </Typography>

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

              <Typography variant="body1" sx={{ my: 1 }}>
                Price: ${cartItem.price.toFixed(2)}
              </Typography>
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
