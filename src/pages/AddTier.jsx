import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, InputLabel, Card, CardContent, Select, MenuItem, FormControl, IconButton } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function AddTier() {
  const navigate = useNavigate();
  const [perkList, setPerkList] = useState([]);
  const [discountType, setDiscountType] = useState('fixed');
  // used to decide if the perk form shd be displayed
  const [showPerkForm, setShowPerkForm] = useState(false);

  const handlePerkFormOpen = () => {
    setShowPerkForm(true);
  };

  // used to cancel the perk form and hide it when clicked
  const handlePerkCancel = () => {
    formikPerk.resetForm();
    setDiscountType('fixed');
    setShowPerkForm(false);
  };

  const formikPerk = useFormik({
    initialValues: {
      percentageDiscount: '',
      fixedDiscount: '',
      minGroupSize: '',
      minSpend: '',
      voucherQuantity: '',
      tierId: ''
    },
    validationSchema: yup.object({
      percentageDiscount: yup
        .number()
        .min(0, 'Percentage Discount must be >= to 0')
        .max(100, 'Percentage Discount must be <= to 100'),
      fixedDiscount: yup
        .number()
        .integer('Value must be an integer')
        .min(0, 'Fixed Discount must be greater than or equal to 0'),
      minGroupSize: yup
        .number()
        .integer('Value must be an integer')
        .min(1, 'Min Grp Size must be >= to 1')
        .required('Min Grp Size is required'),
      minSpend: yup
        .number()
        .min(0, 'Minimum Spend must be >= to 0')
        .required('Min Spend is required'),
      voucherQuantity: yup
        .number()
        .integer('Value must be an integer')
        .min(1, 'Qty must be >= to 1')
        .required('Qty is required'),
    }),
    onSubmit: (data) => {
      // Resets the opposite fields based on the selected discount type
      // Prevents submission of both percentage discount and fixed discount tgt
      // which would otherwise cause the API to not go through
      if (discountType === 'percentage') {
        data.fixedDiscount = 0
      } else if (discountType === 'fixed') {
        data.percentageDiscount = 0
      }
      data.percentageDiscount = Number(data.percentageDiscount);
      data.fixedDiscount = Number(data.fixedDiscount);
      data.minGroupSize = Number(data.minGroupSize);
      data.minSpend = Number(data.minSpend);
      data.voucherQuantity = Number(data.voucherQuantity);
      setPerkList((prevPerkList) => [...prevPerkList, data]);

      // Resets the form and discountType dropdown state
      formikPerk.resetForm();
      setDiscountType('fixed');

      setShowPerkForm(false);
    }
  });

  const formikTier = useFormik({
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
          console.log(res.data);
          navigate("/manageloyalty");
        });
    }
  });

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Add Tier
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5} lg={6}>
          <Box component="form" onSubmit={formikTier.handleSubmit}>
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
                fullWidth margin="dense" autoComplete="off"
                label="Tier Name"
                name="tierName"
                value={formikTier.values.tierName}
                onChange={formikTier.handleChange}
                onBlur={formikTier.handleBlur}
                error={formikTier.touched.tierName && Boolean(formikTier.errors.tierName)}
                helperText={formikTier.touched.tierName && formikTier.errors.tierName}
                size="small"
              />
              <TextField
                sx={{ my: 1, fontSize: '1rem' }}
                fullWidth margin="dense" autoComplete="off"
                label="Tier Bookings"
                name="tierBookings"
                type="number"
                value={formikTier.values.tierBookings}
                onChange={formikTier.handleChange}
                onBlur={formikTier.handleBlur}
                error={formikTier.touched.tierBookings && Boolean(formikTier.errors.tierBookings)}
                helperText={formikTier.touched.tierBookings && formikTier.errors.tierBookings}
                size="small"
              />
              <TextField
                sx={{ my: 1, fontSize: '1rem' }}
                fullWidth margin="dense" autoComplete="off"
                label="Tier Spendings"
                name="tierSpendings"
                type="number"
                value={formikTier.values.tierSpendings}
                onChange={formikTier.handleChange}
                onBlur={formikTier.handleBlur}
                error={formikTier.touched.tierSpendings && Boolean(formikTier.errors.tierSpendings)}
                helperText={formikTier.touched.tierSpendings && formikTier.errors.tierSpendings}
                InputProps={{
                  startAdornment: "$",
                }}
                size="small"
              />
              <Box sx={{ mt: 2 }}>
              </Box>
            </Box>
            <Button variant="contained" type="submit" onClick={formikTier.handleSubmit}>
              Add
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={7} lg={6}>
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
              Tier Perks
            </InputLabel>
            <Box sx={{ my: 2 }}>
              {perkList.map((perk, index) => (
                <Card key={index} sx={{ my: 1, borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#fff', border: '1px solid #ddd' }}>
                  <CardContent>
                    <Typography sx={{ textAlign: 'center' }}>
                      Gift Voucher
                    </Typography>
                    {perk.percentageDiscount === 0 &&
                      <Typography>${perk.fixedDiscount} off</Typography>
                    }
                    {perk.fixedDiscount === 0 &&
                      <Typography>{perk.percentageDiscount}% off</Typography>
                    }
                  </CardContent>
                </Card>
              ))}
            </Box>

            {!showPerkForm && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flexGrow: 1 }} />
                <Button fullWidth onClick={handlePerkFormOpen} sx={{ color: 'inherit', border: '1px dotted #000' }}>
                  <Add />
                </Button>
              </Box>
            )}

            {showPerkForm && (
              <Card sx={{ my: 1, borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#fff', border: '1px solid #ddd' }}>
                <Box component="form" onSubmit={formikTier.handleSubmit} sx={{ padding: 2 }}>
                  <FormControl fullWidth sx={{ my: 1 }}>
                    <Select
                      sx={{ fontSize: '1rem' }}
                      fullWidth name="discountType"
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                      size="small"
                    >
                      <MenuItem value="fixed">fixed discount ($)</MenuItem>
                      <MenuItem value="percentage">percentage discount (%)</MenuItem>
                    </Select>
                  </FormControl>

                  <Grid container spacing={2}>
                    <Grid item xs={8} md={8} lg={8}>
                      {discountType === "fixed" && (
                        <TextField
                          sx={{ my: 1, fontSize: '1rem' }}
                          fullWidth margin="dense" autoComplete="off"
                          label="Fixed Discount"
                          name="fixedDiscount"
                          value={formikPerk.values.fixedDiscount}
                          onChange={formikPerk.handleChange}
                          onBlur={formikPerk.handleBlur}
                          error={formikPerk.touched.fixedDiscount && Boolean(formikPerk.errors.fixedDiscount)}
                          helperText={formikPerk.touched.fixedDiscount && formikPerk.errors.fixedDiscount}
                          InputProps={{
                            startAdornment: "$",
                          }}
                          size="small"
                        />
                      )}
                      {discountType === "percentage" && (
                        <TextField
                          sx={{ my: 1, fontSize: '1rem' }}
                          fullWidth margin="dense" autoComplete="off"
                          label="Percentage Discount"
                          name="percentageDiscount"
                          value={formikPerk.values.percentageDiscount}
                          onChange={formikPerk.handleChange}
                          onBlur={formikPerk.handleBlur}
                          error={formikPerk.touched.percentageDiscount && Boolean(formikPerk.errors.percentageDiscount)}
                          helperText={formikPerk.touched.percentageDiscount && formikPerk.errors.percentageDiscount}
                          InputProps={{
                            endAdornment: "%",
                          }}
                          size="small"
                        />
                      )}
                    </Grid>
                    <Grid item xs={4} md={4} lg={4}>
                      <TextField
                        sx={{ my: 1, fontSize: '1rem' }}
                        fullWidth margin="dense" autoComplete="off"
                        label="Voucher Qty"
                        name="voucherQuantity"
                        type="number"
                        value={formikPerk.values.voucherQuantity}
                        onChange={formikPerk.handleChange}
                        onBlur={formikPerk.handleBlur}
                        error={formikPerk.touched.voucherQuantity && Boolean(formikPerk.errors.voucherQuantity)}
                        helperText={formikPerk.touched.voucherQuantity && formikPerk.errors.voucherQuantity}
                        size="small"
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6} md={6} lg={6}>
                      <TextField
                        sx={{ my: 1, fontSize: '1rem' }}
                        fullWidth margin="dense" autoComplete="off"
                        label="Min Spend"
                        name="minSpend"
                        value={formikPerk.values.minSpend}
                        onChange={formikPerk.handleChange}
                        onBlur={formikPerk.handleBlur}
                        error={formikPerk.touched.minSpend && Boolean(formikPerk.errors.minSpend)}
                        helperText={formikPerk.touched.minSpend && formikPerk.errors.minSpend}
                        InputProps={{
                          startAdornment: "$",
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6} md={6} lg={6}>
                      <TextField
                        sx={{ my: 1, fontSize: '1rem' }}
                        fullWidth margin="dense" autoComplete="off"
                        label="Min Grp Size"
                        name="minGroupSize"
                        type="number"
                        value={formikPerk.values.minGroupSize}
                        onChange={formikPerk.handleChange}
                        onBlur={formikPerk.handleBlur}
                        error={formikPerk.touched.minGroupSize && Boolean(formikPerk.errors.minGroupSize)}
                        helperText={formikPerk.touched.minGroupSize && formikPerk.errors.minGroupSize}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button variant='contained' type="submit" onClick={formikPerk.handleSubmit} sx={{ my: 1, fontSize: '1rem', mr: 2 }}>
                      Save
                    </Button>
                    <Button variant='contained' type="submit" onClick={handlePerkCancel} color='error' sx={{ my: 1, fontSize: '1rem' }}>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </Card>
            )}


          </Box>
        </Grid>

      </Grid>
    </Box >
  );
}

export default AddTier