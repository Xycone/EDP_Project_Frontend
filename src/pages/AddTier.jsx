import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, InputLabel, Card, CardContent, Select, MenuItem, FormControl, IconButton } from '@mui/material';
import { Add } from '@mui/icons-material';
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
        .integer('Value must be an integer')
        .min(1, 'Tier bookings must be at least 1')
        .required('Tier bookings is required'),
      tierSpendings: yup.number()
        .min(1, 'Tier spendings must be at least 1')
        .required('Tier spendings is required'),
    }),
    onSubmit: (data) => {
      data.tierName = data.tierName.trim();
      data.tierBookings = Number(data.tierBookings);
      data.tierSpendings = Number(data.tierSpendings);
      http.post("/tier", data)
        .then((res) => {
          navigate("/manageloyalty");
        });
    }
  });

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Add Tier
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5} lg={5}>
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
                Tier Info
              </InputLabel>
              <TextField
                sx={{ my: 1, mt: 2, fontSize: '1rem' }}
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Tier Name"
                name="tierName"
                value={formik.values.tierName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.tierName && Boolean(formik.errors.tierName)}
                helperText={formik.touched.tierName && formik.errors.tierName}
              />

              <TextField
                sx={{ my: 1, fontSize: '1rem' }}
                fullWidth
                margin="dense"
                autoComplete="off"
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
                sx={{ my: 1, fontSize: '1rem' }}
                fullWidth
                margin="dense"
                autoComplete="off"
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
                <Button variant="contained" type="submit" onClick={formik.handleSubmit}>
                  Create Tier
                </Button>
              </Box>
            </Box>

          </Grid>
        </Grid>

      </Box>
    </Box >
  );
}

export default AddTier