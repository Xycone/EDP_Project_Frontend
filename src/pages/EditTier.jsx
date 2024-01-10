import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';


function EditTier() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Array of possible tier positions
  const [tierPositions, setTierPositions] = useState([]);

  const [tier, setTier] = useState({
    tierName: "",
    tierBookings: "",
    tierSpendings: "",
    tierPosition: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get(`/tier/${id}`).then((res) => {
      setTier(res.data);
      setLoading(false);
    });

    http.get('/tier/get-tiers').then((res) => {
      const newTierPositions = Array.from({ length: res.data }, (_, index) => index + 1);
      setTierPositions(newTierPositions);
    });
  }, []);

  const formik = useFormik({
    initialValues: tier,
    enableReinitialize: true,
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
      tierPosition: yup.number().required('Tier position is required'),
    }),
    onSubmit: (data) => {
      data.tierName = data.tierName.trim();
      data.tierBookings = Number(data.tierBookings);
      data.tierSpendings = Number(data.tierSpendings);
      data.tierPosition = Number(data.tierPosition);
      http.put(`/tier/${id}`, data)
        .then((res) => {
          console.log(res.data);
          navigate("/manageloyalty");
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

  const deleteTier = () => {
    http.delete(`/tier/${id}`)
      .then((res) => {
        console.log(res.data);
        navigate("/manageloyalty");
      });
  }

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Edit Tier
      </Typography>
      {
        !loading && (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={8}>
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
                  />
                  <FormControl fullWidth sx={{ my: 1 }}>
                    <InputLabel id="demo-simple-select-label">Tier Position:</InputLabel>
                    <Select
                      sx={{ fontSize: '1rem' }}
                      fullWidth
                      margin="dense"
                      label="Tier Position"
                      name="tierPosition"
                      value={formik.values.tierPosition}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.tierPosition && Boolean(formik.errors.tierPosition)}
                      helperText={formik.touched.tierPosition && formik.errors.tierPosition}
                    >
                      {tierPositions.map((position) => (
                        <MenuItem key={position} value={position}>
                          {position}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Button variant="contained" type="submit">
                Update
              </Button>
              <Button variant="contained" sx={{ ml: 2 }} color="error"
                onClick={handleOpen}>
                Delete
              </Button>
            </Box>
          </Box>
        )
      }

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Delete Tier
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this tier?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit"
            onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error"
            onClick={deleteTier}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EditTier