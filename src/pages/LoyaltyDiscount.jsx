import { Box, Typography, LinearProgress, Card, CardContent, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import http from '../http';

function LoyaltyDiscount() {
  const [info, setInfo] = useState({
    // Initialize with default values or an empty state structure
    id: '',
    userName: '',
    userEmail: '',
    userHp: '',
    totalSpent: '',
    totalBookings: '',
    tierId: '',
    tierName: '',
  });

  const [tier, setTier] = useState({
    // Initialize with default values or an empty state structure
    id: '',
    tierName: '',
    tierBookings: '',
    tierSpendings: '',
    tierPosition: '',
    CreatedAt: '',
    UpdatedAt: '',
  });

  const [perkList, setPerkList] = useState([]);
  const [bookingProgress, setBookingProgress] = useState(0);
  const [spendingProgress, setSpendingProgress] = useState(0);

  // API Calls
  const getInfo = () => {
    http.get(`/user/profile`).then((res) => {
      setInfo(res.data)
    })
  };
  const getTier = () => {
    http.get(`/tier/${Number(info.tierId)}`).then((res) => {
      setTier(res.data)
    })
  };

  const getPerks = () => {
    http.get(`/perk/${Number(info.tierId)}`).then((res) => {
      setPerkList(res.data);
    })
  };

  useEffect(() => {
    getInfo();
  }, []);

  const calculateSpendingProgress = () => {
    const progress = tier.tierSpendings !== 0 ? (info.totalSpent / tier.tierSpendings) * 100 : 0;
    console.log("Spending progress" + progress)
    return Math.min(progress, 100);
  };

  const calculateBookingProgress = () => {
    const progress = tier.tierBookings !== 0 ? (info.totalBookings / tier.tierBookings) * 100 : 0;
    console.log("Booking progress" + progress)
    return Math.min(progress, 100);
  };

  useEffect(() => {
    getTier();
    getPerks();
  }, [info]);

  useEffect(() => {
    if (info.totalSpent !== '' && tier.tierSpendings !== '') {
      setSpendingProgress(calculateSpendingProgress());
    }
    if (info.totalBookings !== '' && tier.tierBookings !== '') {
      setBookingProgress(calculateBookingProgress());
    }
  }, [info, tier]);


  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Loyalty Discount Program
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}>

            <CardContent>
              <Typography sx={{ my: 1, mt: 2, fontSize: '1.2rem' }}>{info.tierName}</Typography>
              <Typography sx={{ fontSize: '1rem' }}>{info.userName}</Typography>
            </CardContent>
            <CardContent sx={{ backgroundColor: 'white', color: 'black' }}>
              <Typography>To unlock next tier:</Typography>
              <Grid container direction='row' spacing={2} alignItems="stretch">
                <Grid item xs={12} lg={5}>
                  <Typography sx={{ my: 1, mt: 2, fontSize: '0.9rem' }}>Amount Spent:</Typography>
                  <Typography sx={{ my: 1, mt: 2, fontSize: '0.9rem' }}>${info.totalSpent} / ${tier.tierSpendings}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={spendingProgress}
                    sx={{ width: '100%', borderRadius: 5 }}
                  />
                </Grid>
                <Grid item xs={12} lg={5}>
                  <Typography sx={{ my: 1, mt: 2, fontSize: '0.9rem' }}>Events Booked:</Typography>
                  <Typography sx={{ my: 1, mt: 2, fontSize: '0.9rem' }}>{info.totalBookings} / {tier.tierBookings}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={bookingProgress}
                    sx={{ width: '100%', borderRadius: 5 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <Card sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}>

            <CardContent>
              <Typography sx={{ fontSize: '1rem' }}>Monthly Benefits: </Typography>
            </CardContent>

            <CardContent sx={{ backgroundColor: 'white', color: 'black' }}>
              <Grid container spacing={2}>
                {perkList.map((perk, index) => (
                  <Grid item xs={12} md={12} lg={6} key={index}>
                    <Card sx={{ my: 1, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#fff', border: '1px solid #ddd' }}>
                      <Grid container>
                        <Grid item xs={4} lg={4} sx={{ color: 'white', backgroundColor: '#E8533F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {perk.minGroupSize < 2 &&
                            <Typography sx={{ padding: "3px", fontSize: "0.9rem", textAlign: "center" }}>
                              Gift Voucher
                            </Typography>
                          }
                          {perk.minGroupSize >= 2 &&
                            <Typography sx={{ padding: "3px", fontSize: "0.9rem", textAlign: "center" }}>
                              Group Voucher
                            </Typography>
                          }

                        </Grid>
                        <Grid item xs={8} lg={8} sx={{ display: 'flex' }}>
                          <CardContent>
                            <Box sx={{ ml: "65px", padding: "3px" }}>
                              {perk.percentageDiscount === 0 &&
                                <Typography sx={{ fontSize: '1rem' }}>${perk.fixedDiscount} off</Typography>
                              }
                              {perk.fixedDiscount === 0 &&
                                <Typography sx={{ fontSize: '1rem' }}>{perk.percentageDiscount}% off</Typography>
                              }

                              <Typography sx={{ fontSize: '0.7rem' }}>Min Spend: ${perk.minSpend}</Typography>

                              {perk.minGroupSize < 2 &&
                                <Typography sx={{ fontSize: '0.7rem' }}>
                                  Grp Size: N/A
                                </Typography>
                              }
                              {perk.minGroupSize >= 2 &&
                                <Typography sx={{ fontSize: '0.7rem' }}>Grp Size: {perk.minGroupSize}</Typography>
                              }
                              <Typography sx={{ fontSize: '0.7rem' }}>Voucher Quantity: {perk.voucherQuantity}</Typography>
                            </Box>
                          </CardContent>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </Box>
  )
}

export default LoyaltyDiscount