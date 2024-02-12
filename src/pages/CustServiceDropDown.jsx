import React from 'react';
import { Typography, Box, Button, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

function CustServiceDropDown() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        id="cust-service-dropdown"
        aria-controls="cust-service-menu"
        aria-haspopup="true"
        aria-expanded={anchorEl ? 'true' : undefined}
        onClick={handleClick}
      >
        Contact Us
      </Button>
      <Menu
        id="cust-service-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleClose}>
          <Link to="/addtickets" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography>Send a Support Ticket</Typography>
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link to="/addreviews" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography>Leave us a Review</Typography>
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link to="/reviews" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography>Look At Our Review</Typography>
          </Link>
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default CustServiceDropDown;
