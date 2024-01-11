import React, { useEffect, useState } from 'react';
import http from '../http';
import { Box, Typography, IconButton, Input, Button, Pagination, List, ListItem, ListItemText } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Delete, Search, Clear } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

function ManageUsers() {
  const [userList, setUserList] = useState([]);

  // API Calls
  const getUsers = () => {
    http.get(`/user/view-users?page=${page}&pageSize=${pageSize}&search=${search}`).then((res) => {
      setTotalPageCount(res.data.totalPages);
      setUserList(res.data.users);
    })
  };
  const deleteSelectedUsers = () => {
    console.log('Selected Users:', selectedRows);
    for (const userId of selectedRows) {
      http.delete(`/user/ban-user/${userId}`);
    }
    // Page refresh after successful deletion of user accounts
    window.location.reload();
    // Clear selected user list after deletion
    setSelectedRows([]);
  };


  // (Datagrid)
  // Table column names used for datagrid
  const columns = [
    { field: 'userName', headerName: 'Name', flex: 0.6 },
    { field: 'userEmail', headerName: 'Email', flex: 1 },
    { field: 'userHp', headerName: 'HP', flex: 0.5 },
    { field: 'tierName', headerName: 'Tier', flex: 0.5 },
  ];

  // Pagination logic
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPageCount, setTotalPageCount] = useState(0);

  const CustomPagination = () => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Pagination
        count={totalPageCount}
        page={page}
        onChange={(event, newPage) => handlePageChange(newPage)}
        showFirstButton
        showLastButton
        color="standard"
        shape="rounded"
        sx={{
          fontSize: '0.6rem',
        }}
      />
    </Box>
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
    getUsers();
  };
  const handlePageSizeChange = (event) => {
    let newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setPage(1);
    getUsers();
  };

  // Datagrid chkbox selection logic
  // Adds the userid of the users selected in the datagrid to selectedUsers
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectionChange = (selection) => {
    setSelectedRows(selection);
  };
  // (Datagrid)


  // (Search)
  const [search, setSearch] = useState('');

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const searchUsers = () => {
    http.get(`/user/view-users?page=${page}&pageSize=${pageSize}&search=${search}`).then((res) => {
      setTotalPageCount(res.data.totalPages);
      setUserList(res.data.users);
    })
  };
  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchUsers();
    }
  };
  const onClickSearch = () => {
    searchUsers();
  }
  const onClickClear = () => {
    setSearch('');
    getUsers();
  };
  // (Search)

  // (Delete confirmation)
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    // Delete confirmation does not open unless there is something selected
    if (selectedRows.length > 0) {
      setOpen(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  // (Delete confirmation)


  useEffect(() => {
    getUsers();
  }, [page, pageSize, search]);

  return (
    <Box sx={{ my: 2}}>
      <Typography variant="h6" sx={{ mb: 2, mr: 1}}>
        Manage Users
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
        <Typography sx={{ fontSize: '0.8rem', mr: 1 }}>Items per page:</Typography>
        <Input
          type="number"
          value={pageSize}
          onChange={handlePageSizeChange}
          sx={{
            '& input': {
              fontSize: '0.8rem',
              width: '80px',
            },
          }}
        />
        <Button color="error" onClick={handleOpen}>
          <Delete />
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Account Termination
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to terminate the following users?
            <List>
              {selectedRows.map((userId) => {
                const user = userList.find((user) => user.id === userId);
                return user ? (
                  <ListItem key={userId}>
                    <ListItemText primary={`- ${user.userName}`} />
                  </ListItem>
                ) : null;
              })}
            </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit"
            onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error"
            onClick={deleteSelectedUsers}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Box style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={userList}
          columns={columns}
          disableColumnMenu
          disableRowSelectionOnClick
          checkboxSelection
          onRowSelectionModelChange={handleSelectionChange}
          selectionModel={selectedRows}
          components={{
            Pagination: CustomPagination,
          }}
          // Affects the font size of the data items
          sx={{
            backgroundColor: 'white',
            border: '1px solid #ddd',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '16px',
            fontSize: '0.8rem',
          }}
        />
      </Box>
    </Box>

  )
}

export default ManageUsers