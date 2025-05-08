import React from 'react';
import { 
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Box,
  styled,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout
} from '@mui/icons-material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&.scrolled': {
    height: '60px'
  }
}));

const Navbar = ({ username }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="fixed">
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        {/* Partie gauche avec logo et titre */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 2
        }}>
          <img 
            src="/src/assets/logo.png" 
            alt="Logo" 
            style={{ 
              height: 40,
              width: 'auto',
              borderRadius: 4
            }} 
          />
          <Typography 
            variant="h6" 
            component="div"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            LABO <span style={{ color: 'secondary.main' }}>STEM</span>
          </Typography>
        </Box>

        {/* Partie droite avec notifications et profil */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" aria-label="notifications">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton
            onClick={handleMenu}
            color="inherit"
            aria-label="account"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  bgcolor: 'primary.main'
                }}
              >
                {username?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography 
                variant="body1" 
                sx={{ 
                  display: { xs: 'none', md: 'block' },
                  fontWeight: 500
                }}
              >
                {username}
              </Typography>
            </Box>
          </IconButton>

          {/* Menu déroulant */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
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
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleClose}>
              <AccountCircle sx={{ mr: 1.5 }} /> Mon profil
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose} sx={{ color: 'error.main' }}>
              <Logout sx={{ mr: 1.5 }} /> Déconnexion
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;