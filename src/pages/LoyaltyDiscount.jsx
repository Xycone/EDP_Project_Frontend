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
  useEffect(() => {
    getTier();
    getPerks();
    
    const spendingProgress = tier.tierSpendings !== 0 ? (info.totalSpent / tier.tierSpendings) * 100 : 0;
    const bookingProgress = tier.tierBookings !== 0 ? (info.totalBookings / tier.tierBookings) * 100 : 0;

    setSpendingProgress(spendingProgress);
    setBookingProgress(bookingProgress);
  }, [info]);

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Loyalty Discount Program
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6}>
          <Card sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}>

            <CardContent>
              <Typography sx={{ my: 1, mt: 2, fontSize: '1rem' }}>{info.tierName}</Typography>
              <Typography sx={{ fontSize: '0.8rem' }}>{info.userName}</Typography>
            </CardContent>
            <CardContent sx={{ backgroundColor: 'white', color: 'black' }}>
              <Typography>To unlock next tier:</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={5} lg={5}>
                  <Typography sx={{ my: 1, mt: 2, fontSize: '0.8rem' }}>Events Booked:</Typography>
                  <Typography sx={{ my: 1, mt: 2, fontSize: '0.8rem' }}>{info.totalSpent}/{tier.tierSpendings}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={spendingProgress}
                    sx={{ width: '100%', borderRadius: 5 }}
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={5}>
                  <Typography sx={{ my: 1, mt: 2, fontSize: '0.8rem' }}>Amount Spent:</Typography>
                  <Typography sx={{ my: 1, mt: 2, fontSize: '0.8rem' }}>{info.totalBookings}/{tier.tierBookings}</Typography>
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
        <Grid item xs={12} md={6} lg={6}>
          <Card sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}>

            <CardContent>
              <Typography sx={{ fontSize: '0.8rem' }}>Monthly Benefits: </Typography>
            </CardContent>
            <CardContent sx={{ backgroundColor: 'white', color: 'black' }}>
              {perkList.map((perk, index) => (
                                    <Card key={index} sx={{ my: 1, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#fff', border: '1px solid #ddd' }}>
                                        <Grid container>
                                            <Grid item xs={3} md={3} lg={3} sx={{ color: 'white', backgroundColor: '#E8533F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {perk.minGroupSize < 2 &&
                                                    <Typography sx={{ padding: "3px", fontSize: "1rem", textAlign: "center" }}>
                                                        Gift Voucher
                                                    </Typography>
                                                }
                                                {perk.minGroupSize >= 2 &&
                                                    <Typography sx={{ padding: "3px", fontSize: "1rem", textAlign: "center" }}>
                                                        Group Voucher
                                                    </Typography>
                                                }

                                            </Grid>
                                            <Grid item xs={7} md={7} lg={7} sx={{ display: 'flex' }}>
                                                <CardContent>
                                                    <Box sx={{ ml: "65px", padding: "3px" }}>
                                                        {perk.percentageDiscount === 0 &&
                                                            <Typography sx={{ fontSize: "1.2rem" }}>${perk.fixedDiscount} off</Typography>
                                                        }
                                                        {perk.fixedDiscount === 0 &&
                                                            <Typography sx={{ fontSize: "1.2rem" }}>{perk.percentageDiscount}% off</Typography>
                                                        }

                                                        <Typography sx={{ fontSize: "0.7rem" }}>Min Spend: ${perk.minSpend}</Typography>

                                                        {perk.minGroupSize < 2 &&
                                                            <Typography sx={{ fontSize: "0.7rem" }}>
                                                                Grp Size: N/A
                                                            </Typography>
                                                        }
                                                        {perk.minGroupSize >= 2 &&
                                                            <Typography sx={{ fontSize: "0.7rem" }}>Grp Size: {perk.minGroupSize}</Typography>
                                                        }
                                                    </Box>
                                                </CardContent>
                                            </Grid>
                                            <Grid item xs={2} md={2} lg={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography sx={{ fontSize: "0.7rem" }}>x{perk.voucherQuantity}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </Box>
  )
}

export default LoyaltyDiscount