import { Outlet, Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth.service';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Box } from '@mui/material';
import { useState } from 'react';
import { Plane } from 'lucide-react'; // Keeping Lucide for logo flavor
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

const Layout = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
      navigate('/profile');
      handleClose();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppBar position="static" color="transparent" elevation={0} className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <Toolbar>
          <Box display="flex" alignItems="center" flexGrow={1} className="cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-2 text-white shadow-lg shadow-blue-500/30">
                <Plane size={20} />
            </div>
            <Typography variant="h6" component="div" className="text-gray-800 font-bold tracking-tight">
              Vibe<span className="text-blue-500">Holidays</span>
            </Typography>
          </Box>

          {user && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar src={user.avatar_url} alt={user.username} sx={{ width: 32, height: 32, bgcolor: '#3B82F6' }}>
                    {user.first_name ? user.first_name[0] : user.username[0].toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>
                    <PersonIcon fontSize="small" className="mr-2 text-gray-500"/> Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" className="mr-2 text-gray-500"/> Logout
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
