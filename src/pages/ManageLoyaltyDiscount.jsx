import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../http';
import { Box, Typography, IconButton, Input, Button, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Delete, Search, Clear, AccessTime } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import global from '../global';

function ManageLoyaltyDiscount() {
  const [tierList, setTierList] = useState([]);

  // API Calls
  const getTiers = () => {
    http.get('/tier').then((res) => {
      setTierList(res.data);
    })
  };



  // (Search)
  const [search, setSearch] = useState('');

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const searchTiers = () => {
    http.get(`/tier?search=${search}`).then((res) => {
      setTierList(res.data);
    });
  };
  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchTiers();
    }
  };
  const onClickSearch = () => {
    searchTiers();
  }
  const onClickClear = () => {
    setSearch('');
    getTiers();
  };
  // (Search)


  useEffect(() => {
    getTiers();
  }, []);

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, mr: 1 }}>
        Manage Loyalty Program
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Input value={search} placeholder="Search by name"
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
          sx={{
            '& input::placeholder': {
              fontSize: '0.8rem',
            },
          }}
        />
        <IconButton color="primary"
          onClick={onClickSearch}>
          <Search />
        </IconButton>
        <IconButton color="primary"
          onClick={onClickClear}>
          <Clear />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />
        <Link to="/addtier" style={{ textDecoration: 'none' }}>
          <Button variant='contained'>
            Add
          </Button>
        </Link>
      </Box>

      <Grid container spacing={2}>
        {tierList.map((tier) => (
          <Grid item key={tier.id} xs={12} md={6} lg={4}>
            <Link to={`/edittier/${tier.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box
                sx={{
                  border: 1,
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  p: 2,
                  flexGrow: 1,
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'box-shadow 0.3s ease', // Add transition for smooth effect
                  '&:hover': {
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)', // Adjust the shadow on hover
                  },
                }}
              >
                {/* Tier title */}
                <Box sx={{ textAlign: 'center', borderBottom: '2px solid grey', pb: 1, }}>
                  <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '1rem' }}>
                    {tier.tierPosition}. {tier.tierName}
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  {/* Tier info */}
                  <Typography variant="body1" sx={{ margin: 1, fontSize: '0.9rem' }}>
                    Requirements:
                  </Typography>
                  <Typography variant="body2" sx={{ margin: 1, fontSize: '0.8rem' }}>
                    {tier.tierBookings} booking(s)
                  </Typography>
                  <Typography variant="body2" sx={{ margin: 1, fontSize: '0.8rem' }}>
                    ${tier.tierSpendings.toFixed(2)} spent
                  </Typography>
                  <Typography variant="body1" sx={{ margin: 1, fontSize: '0.9rem' }}>
                    Latest Changes:
                  </Typography>
                  <Box variant="body2" sx={{ margin: 1, fontSize: '0.5rem', display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5 }} />
                    <Typography sx={{ fontSize: '0.8rem' }}>
                      {dayjs(tier.updatedAt && tier.updatedAt > tier.createdAt ? tier.updatedAt : tier.createdAt).format(global.datetimeFormat)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>


  )
}

export default ManageLoyaltyDiscount