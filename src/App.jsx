import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MyTheme from './themes/MyTheme';
import { Person, AdminPanelSettings, Menu as MenuIcon, ShoppingCart } from '@mui/icons-material';

import http from './http';
import UserContext from './contexts/UserContext';

import MyForm from './pages/MyForm';
import CustServiceDropDown from './pages/CustServiceDropDown';
import Register from './pages/Register';
import Login from './pages/Login';
import LoyaltyDiscount from './pages/LoyaltyDiscount';
import Orders from './pages/Orders';
import CreateOrders from './pages/CreateOrder';
import EditOrder from './pages/EditOrder';
import ManageUsers from './pages/ManageUsers';
import ManageLoyaltyDiscount from './pages/ManageLoyaltyDiscount';
import AddTier from './pages/AddTier';
import EditTier from './pages/EditTier';
import Cart from './pages/Cart';
import AddCartItem from './pages/AddCartItem';
import EditCartItem from './pages/EditCartItem';
import Checkout from './pages/Checkout';
import TierPerks from './pages/TierPerks';
import AccountPage from './pages/AccountPage';
import CheckoutForm from './pages/CheckoutForm';
import AddReviews from './pages/AddReviews';
import Reviews from './pages/Reviews';
import EditReviews from './pages/EditReviews';
import DelReviews from './pages/DelReviews';
import TicketsPage from './pages/TicketsPage';
import AddTickets from './pages/AddTickets';
import DelTickets from './pages/DelTickets';
import Listings from './pages/Listings'
import Listing from './pages/Listing'
import Activities from './pages/Activities'
import ChangePassword from './pages/ChangePassword';
import TestCart from './pages/TestCart';
import AddListing from './pages/AddListing';
import EditListing from './pages/EditListing';
import AddActivity from './pages/AddActivity';
import EditActivity from './pages/EditActivity';
import Success from './pages/Success';
import Report from './pages/Report';
import OrdersTable from './pages/OrdersTable';
import PurchaseHistory from './pages/PurchaseHistory'
import ListingTable from './pages/ListingTable';

const drawerWidth = 240;

function App() {
  const [user, setUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
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

      http.get('/user/profile-picture').then((res) => {
        setImageFile(res.data.imageFile);
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = '/login';
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
  const handleDrawerToggle = () => {
    setOpen(!open);
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
                    onClick={handleDrawerToggle}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Box sx={{ flexGrow: 0.1 }} />
                </>
              )}
              <Link to="/Listings">
                <Typography variant="h6" noWrap component="div">
                  UPlay
                </Typography>
              </Link>
              <Box sx={{ flexGrow: 1 }} />

              <CustServiceDropDown />


              <Box sx={{ flexGrow: 1 }} />
              {/* User logged in */}
              {user && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {(user && !user.isAdmin || isNotAdminView) && (
                    <IconButton component={Link} to="/testCart" style={{ color: 'inherit' }}>
                      <ShoppingCart />
                    </IconButton>
                  )}
                  <Button onClick={handleMenuOpen} style={{ color: 'white' }}>
                    <Box
                      className="Profile"
                      sx={{
                        width: '40px',
                        height: '40px',
                        minWidth: '40px',
                        mHeight: '40px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        mr: 2,
                      }}
                    >
                      {
                        // User set profile picture
                        imageFile && (
                          <img
                            alt="ProfileImage"
                            src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                              borderRadius: '50%',
                              overflow: 'hidden',
                            }}
                          />
                        )
                      }
                      {
                        // Default profile picture if user did not set anything
                        (!imageFile) && (
                          <img
                            alt="DefaultProfileImage"
                            src={`${import.meta.env.VITE_DEFAULT_PROFILE_PICTURE_URL}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                              borderRadius: '50%',
                            }}
                          />
                        )

                      }
                    </Box>
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
                      <Link to={isNotAdminView ? "/manageusers" : "/Listings"} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                      <Box>
                        <Link key="my-account-link" to={"/myAccount"} style={{ textDecoration: 'none', color: 'inherit' }}>
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

                        <Link to={"/loyaltydiscount"} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MenuItem
                            variant="contained"
                            color="primary"
                            sx={{ marginLeft: '4px' }}
                          >
                            <Typography variant="caption" sx={{ marginLeft: 1 }}>
                              Loyalty Program
                            </Typography>
                          </MenuItem>
                        </Link>

                        <Link to={"/purchasehistory"} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MenuItem
                            variant="contained"
                            color="primary"
                            sx={{ marginLeft: '4px' }}
                          >
                            <Typography variant="caption" sx={{ marginLeft: 1 }}>
                              Purchase history
                            </Typography>
                          </MenuItem>
                        </Link>
                      </Box>
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
                </Box>
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
                  marginTop: '64px',
                },
              }}
              variant="persistent"
              anchor="left"
              open={open}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', borderBottom: '2px solid grey', pb: 1 }}>
                <Typography variant="h6" component="div" sx={{ textAlign: 'center', padding: 2 }}>
                  Admin Menu
                </Typography>
              </Box>

              {/* Admin sidebar links*/}
              <List>
                <ListItem button component={Link} to="/manageusers" onClick={handleDrawerClose} sx={{ fontSize: '1rem' }}>
                  <ListItemText primary="Manage Users" />
                </ListItem>
                <ListItem button component={Link} to="/manageloyalty" onClick={handleDrawerClose} sx={{ fontSize: '1rem' }}>
                  <ListItemText primary="Manage Loyalty Discount" />
                </ListItem>
                <ListItem button component={Link} to="/orders" onClick={handleDrawerClose} sx={{ fontSize: '1rem' }}>
                  <ListItemText primary="Manage Orders" />
                </ListItem>
                <ListItem button component={Link} to="/listings" onClick={handleDrawerClose} sx={{ fontSize: '1rem' }}>
                  <ListItemText primary="Manage Listings" />
                </ListItem>
                <ListItem button component={Link} to="/ticketspage" onClick={handleDrawerClose} sx={{ fontSize: '1rem' }}>
                  <ListItemText primary="Manage tickets" />
                </ListItem>
                <ListItem button component={Link} to="/reviews" onClick={handleDrawerClose} sx={{ fontSize: '1rem' }}>
                  <ListItemText primary="Manage reviews" />
                </ListItem>
                <ListItem button component={Link} to="/report" onClick={handleDrawerClose} sx={{ fontSize: '1rem' }}>
                  <ListItemText primary="View Report" />
                </ListItem>
              </List>
            </Drawer>
          )}

          <Container>
            <Routes>
              <>

                <Route path={"/register"} element={<Register />} />
                <Route path={"/login"} element={<Login />} />

                {/* Idk who's routes */}
                <Route path={"/form"} element={<MyForm />} />
              </>

              {(user && !user.isAdmin || isNotAdminView) && (
                <>
                  {/* Sean's Routes */}
                  <Route path={"/loyaltydiscount"} element={<LoyaltyDiscount />} />
                  <Route path={"/myAccount"} element={<AccountPage />} />
                  <Route path={"/changePassword"} element={<ChangePassword />} />
                  <Route path={"/testCart"} element={<TestCart />} />
                  <Route path={"/Cart"} element={<Cart />} />
                  <Route path={"/Success"} element={<Success />} />

                  {/* Joseph's Routes */}
                  <Route path={"/cart"} element={<Cart />} />
                  <Route path={"/addcartitem"} element={<AddCartItem />} />
                  <Route path={"/editcartitem/:id"} element={<EditCartItem />} />
                  <Route path={"/checkout"} element={<Checkout />} />
                  <Route path={"/edit-order/:id"} element={<EditOrder />} />
                  <Route path={"/checkoutform"} element={<CheckoutForm />} />

                  {/* Raye's Routes */}
                  <Route path={"/purchasehistory"} element={<PurchaseHistory />} />


                  {/* Wayne's Routes */}
                  <Route path={"/reviews"} element={<Reviews />} />
                  <Route path={"/addreviews"} element={<AddReviews />} />
                  <Route path={"/editreviews/:id"} element={<EditReviews />} />
                  <Route path={"/delreviews/:id"} element={<DelReviews />} />


                  {/* Wayne's Routes */}
                  <Route path={"/ticketspage"} element={<TicketsPage />} />
                  <Route path={"/addtickets"} element={<AddTickets />} />

                  {/* An Qi's Routes */}
                  <Route path={"/listings"} element={<Listings />} />
                  <Route path={"/activities/:id"} element={<Activities />} />
                  <Route path={"/listing/:id"} element={<Listing />} />
                </>
              )}

              {/* Admin only pages*/}
              {user && user.isAdmin && !isNotAdminView && (
                <>
                  {/* Raye's Routes */}
                  <Route path="/report" element={<Report />} />
                  <Route path="/orders" element={<OrdersTable />} />

                  {/* Sean's Routes */}
                  <Route path={"/manageusers"} element={<ManageUsers />} />
                  <Route path={"/manageloyalty"} element={<ManageLoyaltyDiscount />} />
                  <Route path={"/addtier"} element={<AddTier />} />
                  <Route path={"/edittier/:id"} element={<EditTier />} />
                  <Route path={"/tierperks/:id"} element={<TierPerks />} />

                  {/* An Qi's Routes */}
                  <Route path={"/editactivity/:id"} element={<EditActivity />} />
                  <Route path={"/addactivity/:id"} element={<AddActivity />} />
                  <Route path={"/editlisting/:id"} element={<EditListing />} />
                  <Route path={"/listingtable"} element={<ListingTable />} />
                  <Route path={"/addlisting"} element={<AddListing/>}/>
                  <Route path={"/listing/:id"} element={<Listing />} />
                  <Route path={"/addlisting"} element={<AddListing />} />

                  {/* Wayne's Routes */}
                  <Route path={"/reviews"} element={<Reviews />} />
                  <Route path={"/addreviews"} element={<AddReviews />} />
                  <Route path={"/editreviews/:id"} element={<EditReviews />} />
                  <Route path={"/delreviews/:id"} element={<DelReviews />} />
                  <Route path={"/ticketspage"} element={<TicketsPage />} />
                  <Route path={"/addtickets"} element={<AddTickets />} />
                  <Route path={"/deltickets/:id"} element={<DelTickets />} />
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
