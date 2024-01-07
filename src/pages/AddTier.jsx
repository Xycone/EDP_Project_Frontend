import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function AddTier() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      tierName: "",
      tierBookings: "",
      tierSpendings: "",
    },
    validationSchema: yup.object({
      tierName: yup.string().trim()
        .min(3, 'Tier name must be at least 3 characters')
        .max(15, 'Tier name must be at most 15 characters')
        .required('Tier name is required'),
      tierBookings: yup.number()
        .min(1, 'Tier bookings must be at least 1')
        .required('Tier bookings is required'),
      tierSpendings: yup.number()
        .min(1, 'Tier spendings must be at least 1')
        .required('Tier spendings is required'),
    }),
    onSubmit: (data) => {
      data.tierName = data.tierName.trim();
      http.post("/tier", data)
        .then((res) => {
          console.log(res.data);
          navigate("/manageloyalty");
        });
    }
  });

  return (
    <Box sx={{ my: 2}}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Add Tier
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth margin="dense" autoComplete="off"
          label="Tier Name"
          name="tierName"
          value={formik.values.tierName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.tierName && Boolean(formik.errors.tierName)}
          helperText={formik.touched.tierName && formik.errors.tierName}
        />
        <TextField
          fullWidth margin="dense" autoComplete="off"
          label="Tier Bookings"
          name="tierBookings"
          type="number"
          value={formik.values.tierBookings}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.tierBookings && Boolean(formik.errors.tierBookings)}
          helperText={formik.touched.tierBookings && formik.errors.tierBookings}
        />
        <TextField
          fullWidth margin="dense" autoComplete="off"
          label="Tier Spendings"
          name="tierSpendings"
          type="number"
          value={formik.values.tierSpendings}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.tierSpendings && Boolean(formik.errors.tierSpendings)}
          helperText={formik.touched.tierSpendings && formik.errors.tierSpendings}
          InputProps={{
            startAdornment: "$",
          }}
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

export default AddTier