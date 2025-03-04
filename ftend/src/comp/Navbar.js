import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { deepPurple } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { styled } from '@mui/system';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#1a1a1a',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.3s ease',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: 'white',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '1rem',
  margin: '0 8px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: deepPurple[500],
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [user, setUser] = React.useState(() => {
    const storedUser = Cookies.get('user');
    return storedUser ? JSON.parse(storedUser) : {};
  });

  React.useEffect(() => {
    const checkUser = () => {
      const storedUser = Cookies.get('user');
      setUser(storedUser ? JSON.parse(storedUser) : {});
    };

    const interval = setInterval(checkUser, 500);
    return () => clearInterval(interval);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const adminPages = [
    { name: 'Home', path: '/adhome' },
    { name: 'Post Job', path: '/addpost' },
    { name: 'Applications Received', path: '/adminapplieddetails' },
    { name: 'Candidates Status', path: '/selectedcandiates' },
  ];

  const userPages = [
    { name: 'Jobs', path: '/userhome' },
    { name: 'Applied Jobs', path: '/appliedjobs' },
  ];

  const settings = [
    { name: 'Profile', path: '/profile' },
    { name: 'Logout', path: '/logout' },
  ];

  return (
    <StyledAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for Desktop */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              transition: 'opacity 0.3s ease',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            JobHunters
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {user?.token && user?.role === 'admin'
                ? adminPages.map((page) => (
                    <MenuItem
                      key={page.name}
                      component={Link}
                      to={page.path}
                      onClick={handleCloseNavMenu}
                    >
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  ))
                : userPages.map((page) => (
                    <MenuItem
                      key={page.name}
                      component={Link}
                      to={page.path}
                      onClick={handleCloseNavMenu}
                    >
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  ))}
            </Menu>
          </Box>

          {/* Logo for Mobile */}
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              transition: 'opacity 0.3s ease',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            JobHunters
          </Typography>

          {/* Desktop Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {user?.token && user?.role === 'admin'
              ? adminPages.map((page) => (
                  <StyledButton
                    key={page.name}
                    component={Link}
                    to={page.path}
                    onClick={handleCloseNavMenu}
                  >
                    {page.name}
                  </StyledButton>
                ))
              : userPages.map((page) => (
                  <StyledButton
                    key={page.name}
                    component={Link}
                    to={page.path}
                    onClick={handleCloseNavMenu}
                  >
                    {page.name}
                  </StyledButton>
                ))}
          </Box>

          {/* User Avatar and Settings */}
          <Box sx={{ flexGrow: 0 }}>
            {user?.token ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <StyledAvatar>
                      {user?.firstName?.charAt(0)?.toUpperCase() || ''}
                      {user?.lastName?.charAt(0)?.toUpperCase() || ''}
                    </StyledAvatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting.name}
                      component={Link}
                      to={setting.path}
                      onClick={handleCloseUserMenu}
                    >
                      <Typography textAlign="center">{setting.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <>
                <StyledButton component={Link} to="/reg">
                  Register
                </StyledButton>
                <StyledButton component={Link} to="/login">
                  Login
                </StyledButton>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar;