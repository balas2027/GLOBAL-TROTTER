import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Box, Button } from '@mui/material';
import { useState } from 'react';
import { Plane, User } from 'lucide-react'; 
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout, openAuthModal, isAuthenticated } = useAuth();
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
    setAnchorEl(null);
    navigate('/dashboard');
  };

  const handleProfile = () => {
      navigate('/profile');
      handleClose();
  }

  const handleAuthAction = (mode) => {
      openAuthModal(mode);
      handleClose();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppBar position="static" color="transparent" elevation={0} className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <Toolbar>
          <Box display="flex" alignItems="center" className="cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-2 text-white shadow-lg shadow-blue-500/30">
                <Plane size={20} />
            </div>
            <Typography variant="h6" component="div" className="text-gray-800 font-bold tracking-tight">
              Vibe<span className="text-blue-500">Holidays</span>
            </Typography>
          </Box>
            
            <div className="hidden md:flex ml-8 gap-1 flex-grow">
                 {isAuthenticated && (
                     <Button 
                        color="inherit" 
                        onClick={() => navigate('/my-trips')}
                        sx={{ textTransform: 'none', color: '#475569', fontWeight: 500, borderRadius: '8px' }}
                     >
                         My Trips
                     </Button>
                 )}
                 {isAuthenticated && (
                     <Button 
                        color="inherit" 
                        onClick={() => navigate('/calendar')}
                        sx={{ textTransform: 'none', color: '#475569', fontWeight: 500, borderRadius: '8px' }}
                     >
                         Calendar
                     </Button>
                 )}
                 <Button 
                    color="inherit" 
                    onClick={() => navigate('/community')}
                    sx={{ textTransform: 'none', color: '#475569', fontWeight: 500, borderRadius: '8px' }}
                 >
                     Community
                 </Button>
                  <Button 
                    color="inherit" 
                    onClick={() => navigate('/search')}
                    sx={{ textTransform: 'none', color: '#475569', fontWeight: 500, borderRadius: '8px' }}
                 >
                     Explore
                 </Button>
                 {isAuthenticated && (user?.username === 'admin' || user?.username === 'admin_traveler') && (
                     <Button 
                        color="inherit" 
                        onClick={() => navigate('/admin')}
                        sx={{ textTransform: 'none', color: '#ef4444', fontWeight: 600, borderRadius: '8px' }}
                     >
                         Admin
                     </Button>
                 )}
            </div>

          <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                 {isAuthenticated && user ? (
                    <Avatar src={user.avatar_url} alt={user.username} sx={{ width: 32, height: 32, bgcolor: '#3B82F6' }}>
                        {user.first_name ? user.first_name[0] : user.username?.[0].toUpperCase()}
                    </Avatar>
                 ) : (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#cbd5e1' }}>
                        <User size={18} className="text-gray-600"/>
                    </Avatar>
                 )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        borderRadius: '12px',
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
              >
                {isAuthenticated ? (
                    [
                        <MenuItem key="profile" onClick={handleProfile}>
                            <PersonIcon fontSize="small" className="mr-2 text-gray-500"/> Profile
                        </MenuItem>,
                         <MenuItem key="mytrips" onClick={() => { navigate('/my-trips'); handleClose(); }}>
                            <Plane fontSize="small" className="mr-2 text-gray-500"/> My Trips
                        </MenuItem>,
                         <MenuItem key="calendar" onClick={() => { navigate('/calendar'); handleClose(); }}>
                            <span className="text-gray-500 mr-2 text-lg">📅</span> Calendar
                        </MenuItem>,
                        ((user?.username === 'admin' || user?.username === 'admin_traveler') ? (
                            <MenuItem key="admin" onClick={() => { navigate('/admin'); handleClose(); }}>
                                <span className="text-red-500 mr-2 text-lg">🛡️</span> Admin Panel
                            </MenuItem>
                        ) : null),
                        <MenuItem key="logout" onClick={handleLogout}>
                            <LogoutIcon fontSize="small" className="mr-2 text-gray-500"/> Logout
                        </MenuItem>
                    ]
                ) : (
                    [
                        <MenuItem key="login" onClick={() => handleAuthAction('login')}>
                            <LoginIcon fontSize="small" className="mr-2 text-gray-500"/> Log In
                        </MenuItem>,
                        <MenuItem key="signup" onClick={() => handleAuthAction('signup')}>
                            <PersonAddIcon fontSize="small" className="mr-2 text-gray-500"/> Sign Up
                        </MenuItem>
                    ]
                )}
              </Menu>
            </div>
        </Toolbar>
      </AppBar>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
