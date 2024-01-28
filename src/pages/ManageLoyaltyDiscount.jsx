import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../http';
import { Box, Typography, IconButton, Input, Button } from '@mui/material';
import { Search, Clear, AccessTime, Edit, ChevronRight } from '@mui/icons-material';
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


  // (DataGrid)
  const columns = [   
    { field: 'tierName', headerName: 'Tier Name', flex: 0.7 },
    { field: 'tierBookings', headerName: 'Bookings', flex: 0.6 },
    { field: 'tierSpendings', headerName: 'Spendings', flex: 0.6 },
    { field: 'tierPosition', headerName: 'Position', flex: 0.4 },
    {
      field: 'updatedAt',
      headerName: 'Last Updated',
      flex: 0.9,
      valueGetter: (params) => dayjs(params.row.updatedAt && params.row.updatedAt > params.row.createdAt ? params.row.updatedAt : params.row.createdAt).format(global.datetimeFormat),
      renderCell: (params) => (
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <AccessTime sx={{ mr: 1, fontSize: '0.8rem'  }} />
          {dayjs(params.row.updatedAt && params.row.updatedAt > params.row.createdAt ? params.row.updatedAt : params.row.createdAt).format(global.datetimeFormat)}
        </Box>
      ),
    },
    {
      field: 'Edit',
      headerName: '',
      flex: 0.4,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Link to={`/edittier/${params.row.id}`} style={{ textDecoration: 'none' }}>
          <IconButton size="small" variant="outlined" color="primary">
            <Edit />
          </IconButton>
        </Link>
      ),
    },
    {
      field: 'TierPerks',
      headerName: '',
      flex: 0.4,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Link to={`/tierperks/${params.row.id}`} style={{ textDecoration: 'none' }}>
          <IconButton size="small" variant="outlined" color="primary">
            <ChevronRight />
          </IconButton>
        </Link>
      ),
    },
  ];
  // (DataGrid)


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
        <Input value={search} placeholder="Search by tier name"
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
      </Box>
      <DataGrid
        rows={tierList}
        columns={columns}
        disableColumnMenu
        disableRowSelectionOnClick
        hideFooter
        // Affects the font size of the data items
        sx={{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '16px',
          fontSize: '0.8rem',
        }}
      />
      <Link to="/addtier" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
        <Button variant='contained' style={{ width: '100%', marginTop: '16px' }}>
          Create Tier
        </Button>
      </Link>
    </Box>



  )
}

export default ManageLoyaltyDiscount