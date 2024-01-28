import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MyTheme from './themes/MyTheme';
import { Person, AdminPanelSettings, Menu as MenuIcon, ChevronLeft } from '@mui/icons-material';

import Tutorials from './pages/Tutorials';
import AddTutorial from './pages/AddTutorial';
import EditTutorial from './pages/EditTutorial';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import http from './http';
import UserContext from './contexts/UserContext';
import LoyaltyDiscount from './pages/LoyaltyDiscount';
import ManageUsers from './pages/ManageUsers';
import ManageLoyaltyDiscount from './pages/ManageLoyaltyDiscount';
import AddTier from './pages/AddTier';
import EditTier from './pages/EditTier';
import Listings from './pages/Listings';
import EditListing from './pages/EditListing';
import AddListing from './pages/AddListing';
import Activities from './pages/Activities';
import EditActivity from './pages/EditActivity';
import AddActivity from './pages/AddActivity';

const drawerWidth = 240;

function App() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isNotAdminView, setIsNotAdminView] = useState(
    localStorage.getItem('isAdminView') === 'true' // Read from local storage
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = '/';
  };

  // navbar dropdown
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // view toggle
  const toggleAdminView = () => {
    setIsNotAdminView((prevIsNotAdminView) => {
      const newIsNotAdminView = !prevIsNotAdminView;
      localStorage.setItem('isAdminView', String(newIsNotAdminView)); // Save to local storage
      return newIsNotAdminView;
    });
  };

  // admin view sidebar
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar">
            <Toolbar>
              {user && user.isAdmin && !isNotAdminView && (
                <>
                  <IconButton
                    color="inherit"
                    onClick={handleDrawerOpen}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Box sx={{ flexGrow: 0.1 }} />
                </>
              )}
              <Typography variant="h6" noWrap component="div">
                UPlay
              </Typography>
              <Box sx={{ flexGrow: 1 }} />

              {/* User navbar items */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <>
                  <Link to="/tutorials">
                    <Typography component="div">
                      Tutorials
                    </Typography>
                  </Link>
                </>
                <>
                  <Link to="/addtutorial">
                    <Typography component="div">
                      AddTutorial
                    </Typography>
                  </Link>
                </>
                <Link to="/Listings">
                    <Typography component="div">
                      Listings
                    </Typography>
                  </Link>
              </Box>

              <Box sx={{ flexGrow: 1 }} />
              {/* User logged in */}
              {user && (
                <>
                  <Button onClick={handleMenuOpen} style={{ color: 'white' }}>
                    <Typography component="div">
                      {user.userName}
                    </Typography>
                  </Button>

                  {/* Dropdown menu for the user's name */}
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    {/* Admin view toggle */}
                    {user.isAdmin && (
                      <Link to={isNotAdminView ? "/manageusers" : "/tutorials"} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuItem
                          onClick={toggleAdminView}
                          variant="contained"
                          color="primary"
                          sx={{ marginLeft: '4px' }}
                        >
                          <Typography variant="caption" sx={{ marginLeft: 1 }}>
                            {isNotAdminView ? 'User View' : 'Admin View'}
                          </Typography>
                          {isNotAdminView ? <Person /> : <AdminPanelSettings />}
                        </MenuItem>
                      </Link>
                    )}

                    {/* User View menu items */}
                    {(!user.isAdmin || isNotAdminView) && (
                      <>
                        <Link to={"/"} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MenuItem
                            variant="contained"
                            color="primary"
                            sx={{ marginLeft: '4px' }}
                          >
                            <Typography variant="caption" sx={{ marginLeft: 1 }}>
                              My Account
                            </Typography>
                          </MenuItem>
                        </Link>

                        <Link to={"/"} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MenuItem
                            variant="contained"
                            color="primary"
                            sx={{ marginLeft: '4px' }}
                          >
                            <Typography variant="caption" sx={{ marginLeft: 1 }}>
                              My Transactions
                            </Typography>
                          </MenuItem>
                        </Link>
                      </>
                    )}

                    {/* Logout button */}
                    <MenuItem
                      onClick={logout}
                      sx={{ marginLeft: '4px' }}
                    >
                      <Typography variant="caption" sx={{ marginLeft: 1 }}>
                        Logout
                      </Typography>
                    </MenuItem>
                  </Menu>
                </>
              )}

              {/* User not logged in */}
              {!user && (
                <>
                  <Link to="/register">Register</Link>
                  <Link to="/login" ><Typography>Login</Typography></Link>
                </>
              )}
            </Toolbar>
          </AppBar>

          {/* Drawer */}
          {!isNotAdminView && (
            <Drawer
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  boxSizing: 'border-box',
                },
              }}
              variant="persistent"
              anchor="left"
              open={open}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', borderBottom: '2px solid grey', pb: 1 }}>
                <IconButton onClick={handleDrawerClose}>
                  <ChevronLeft />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ textAlign: 'center', padding: 2 }}>
                  Admin
                </Typography>
              </Box>

              {/* Admin sidebar links*/}
              <List>
                <ListItem button component={Link} to="/manageusers" onClick={handleDrawerClose} sx={{fontSize: '1rem'}}>
                  <ListItemText primary="Manage Users" />
                </ListItem>
                <ListItem button component={Link} to="/manageloyalty" onClick={handleDrawerClose} sx={{fontSize: '1rem'}}>
                  <ListItemText primary="Manage Loyalty Discount" />
                </ListItem>
              </List>
            </Drawer>
          )}

          <Container>
            <Routes>
              <>
                <Route path={"/tutorials"} element={<Tutorials />} />
                <Route path={"/addtutorial"} element={<AddTutorial />} />
                <Route path={"/edittutorial/:id"} element={<EditTutorial />} />
                <Route path={"/register"} element={<Register />} />
                <Route path={"/login"} element={<Login />} />
                <Route path={"/form"} element={<MyForm />} />
                <Route path={"/loyaltydiscount"} element={<LoyaltyDiscount />} />
                <Route path={"/listings"} element={<Listings />} />
                <Route path={"/editlisting/:id"} element={<EditListing />} />
                <Route path={"/addlisting"} element={<AddListing />} />
                <Route path={"/activities/:id"} element={<Activities />} />
                <Route path={"/editactivity/:id"} element={<EditActivity />} />
                <Route path={"/addactivity/:id"} element={<AddActivity />} />
              </>
              {/* Admin only pages*/}
              {user && user.isAdmin && !isNotAdminView && (
                <>
                  <Route path={"/manageusers"} element={<ManageUsers />} />
                  <Route path={"/manageloyalty"} element={<ManageLoyaltyDiscount />} />
                  <Route path={"/addtier"} element={<AddTier />} />
                  <Route path={"/edittier/:id"} element={<EditTier />} />
                </>
              )}
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider >
  );
}

export default App;
