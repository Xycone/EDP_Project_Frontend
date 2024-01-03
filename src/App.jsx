import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MyTheme from './themes/MyTheme';
import { Person, AdminPanelSettings } from '@mui/icons-material';

import Tutorials from './pages/Tutorials';
import AddTutorial from './pages/AddTutorial';
import EditTutorial from './pages/EditTutorial';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import http from './http';
import UserContext from './contexts/UserContext';
import LoyaltyDiscount from './pages/LoyaltyDiscount';
import AdminMenu from './pages/AdminMenu';

function App() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isNotAdminView, setIsNotAdminView] = useState(
    localStorage.getItem('isAdminView') === 'true' // Read from local storage
  );

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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleAdminView = () => {
    setIsNotAdminView((prevIsNotAdminView) => {
      const newIsNotAdminView = !prevIsNotAdminView;
      localStorage.setItem('isAdminView', String(newIsNotAdminView)); // Save to local storage
      return newIsNotAdminView;
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <Typography variant="h6" component="div">
                  UPlay
                </Typography>
                <Box sx={{ flexGrow: 1 }}></Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* User navbar items */}
                  <>
                    <Link to="/tutorials">
                      <Typography component="div">
                        Tutorials
                      </Typography>
                    </Link><Link to="/addtutorial">
                      <Typography component="div">
                        AddTutorial
                      </Typography>
                    </Link>
                  </>
                </Box>

                <Box sx={{ flexGrow: 1 }}></Box>
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
                        <Link to={isNotAdminView ? "/adminmenu" : "/tutorials"} style={{ textDecoration: 'none', color: 'inherit' }}>
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

                      {isNotAdminView && (
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
                )
                }
                {!user && (
                  <>
                    <Link to="/register" ><Typography>Register</Typography></Link>
                    <Link to="/login" ><Typography>Login</Typography></Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>

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
              </>
              {/* Admin only pages*/}
              {user && user.isAdmin && !isNotAdminView && (
                <>
                  <Route path="/adminmenu" element={<AdminMenu />} />
                </>
              )}
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
