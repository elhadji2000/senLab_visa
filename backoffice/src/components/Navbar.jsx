import React, { useState } from 'react';
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
  Badge,
  useScrollTrigger,
  Slide,
  CssBaseline,
  Container,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout,
  Home,
  Person,
  Add,
  List as ListIcon,
  Science,
  School,
  Quiz,
  ExpandMore,
  ExpandLess,
  Dashboard
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[3],
  transition: 'all 0.3s ease',
}));

const NavLink = styled(Button)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  fontWeight: active ? 600 : 400,
  textTransform: 'none',
  margin: theme.spacing(0, 0.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DropdownContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  zIndex: theme.zIndex.appBar + 1,
  minWidth: 200,
  boxShadow: theme.shadows[4],
}));

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = ({ username }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      <CssBaseline />
      <HideOnScroll>
        <StyledAppBar position="fixed">
          {/* Barre principale */}
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              py: 1
            }}>
              {/* Partie gauche - Logo et menu mobile */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 2
              }}>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 1, display: { md: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
                
                <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <img 
                    src="/src/assets/logoLab.jpg" 
                    alt="Logo" 
                    style={{ 
                      height: 40,
                      width: 'auto',
                      borderRadius: 4,
                      marginRight: 12
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
              </Box>

              {/* Partie centrale - Navigation (version desktop) */}
              <Box sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                alignItems: 'center',
                gap: 1
              }}>
                <NavLink 
                  component={Link}
                  to="/dashboard"
                  startIcon={<Home />}
                  active={isActive('/dashboard')}
                >
                  Dashboard
                </NavLink>

                {/* Menu Utilisateur */}
                <Box sx={{ position: 'relative' }}>
                  <NavLink 
                    onClick={() => toggleDropdown('user')}
                    startIcon={<Person />}
                    endIcon={openDropdown === 'user' ? <ExpandLess /> : <ExpandMore />}
                    active={location.pathname.includes('/utilisateur')}
                  >
                    Utilisateur
                  </NavLink>
                  {openDropdown === 'user' && (
                    <DropdownContainer>
                      <List dense>
                        <ListItem 
                          button 
                          component={Link} 
                          to="/utilisateur/ajouter"
                          selected={isActive('/utilisateur/ajouter')}
                        >
                          <ListItemIcon><Add fontSize="small" /></ListItemIcon>
                          <ListItemText primary="Ajouter" />
                        </ListItem>
                        <ListItem 
                          button 
                          component={Link} 
                          to="/utilisateur/lister"
                          selected={isActive('/utilisateur/lister')}
                        >
                          <ListItemIcon><ListIcon fontSize="small" /></ListItemIcon>
                          <ListItemText primary="Lister" />
                        </ListItem>
                      </List>
                    </DropdownContainer>
                  )}
                </Box>

                {/* Menu Simulations */}
                <Box sx={{ position: 'relative' }}>
                  <NavLink 
                    onClick={() => toggleDropdown('simulations')}
                    startIcon={<Science />}
                    endIcon={openDropdown === 'simulations' ? <ExpandLess /> : <ExpandMore />}
                    active={location.pathname.includes('/simulations')}
                  >
                    Simulations
                  </NavLink>
                  {openDropdown === 'simulations' && (
                    <DropdownContainer>
                      <List dense>
                        <ListItem 
                          button 
                          component={Link} 
                          to="/simulations/ajouter"
                          selected={isActive('/simulations/ajouter')}
                        >
                          <ListItemIcon><Add fontSize="small" /></ListItemIcon>
                          <ListItemText primary="Ajouter" />
                        </ListItem>
                        <ListItem 
                          button 
                          component={Link} 
                          to="/simulations/explorer"
                          selected={isActive('/simulations/explorer')}
                        >
                          <ListItemIcon><School fontSize="small" /></ListItemIcon>
                          <ListItemText primary="Explorer" />
                        </ListItem>
                        <ListItem 
                          button 
                          component={Link} 
                          to="/simulations/all1"
                          selected={isActive('/simulations/all1')}
                        >
                          <ListItemIcon><ListIcon fontSize="small" /></ListItemIcon>
                          <ListItemText primary="Toutes" />
                        </ListItem>
                      </List>
                    </DropdownContainer>
                  )}
                </Box>

                {/* Menu Quizz */}
                <Box sx={{ position: 'relative' }}>
                  <NavLink 
                    onClick={() => toggleDropdown('quizz')}
                    startIcon={<Quiz />}
                    endIcon={openDropdown === 'quizz' ? <ExpandLess /> : <ExpandMore />}
                    active={location.pathname.includes('/quizz')}
                  >
                    Gestion Quizz
                  </NavLink>
                  {openDropdown === 'quizz' && (
                    <DropdownContainer>
                      <List dense>
                        <ListItem 
                          button 
                          component={Link} 
                          to="/quizz/ajouter"
                          selected={isActive('/quizz/ajouter')}
                        >
                          <ListItemIcon><Add fontSize="small" /></ListItemIcon>
                          <ListItemText primary="Créer" />
                        </ListItem>
                        <ListItem 
                          button 
                          component={Link} 
                          to="/quizz/lister"
                          selected={isActive('/quizz/lister')}
                        >
                          <ListItemIcon><ListIcon fontSize="small" /></ListItemIcon>
                          <ListItemText primary="Tous les Quizz" />
                        </ListItem>
                      </List>
                    </DropdownContainer>
                  )}
                </Box>
              </Box>

              {/* Partie droite - Notifications et profil */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton color="inherit" aria-label="notifications">
                  <Badge badgeContent={4} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                
                <IconButton
                  onClick={handleProfileMenu}
                  color="inherit"
                  aria-label="account"
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32,
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

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      overflow: 'visible',
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
          </Container>

          {/* Menu mobile */}
          <Collapse in={mobileOpen} timeout="auto" unmountOnExit sx={{ display: { md: 'none' } }}>
            <Paper sx={{ py: 1, px: 2 }}>
              <List>
                <ListItem button component={Link} to="/dashboard" selected={isActive('/dashboard')}>
                  <ListItemIcon><Dashboard /></ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>

                <ListItem button onClick={() => toggleDropdown('user-mobile')}>
                  <ListItemIcon><Person /></ListItemIcon>
                  <ListItemText primary="Utilisateur" />
                  {openDropdown === 'user-mobile' ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openDropdown === 'user-mobile'} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem 
                      button 
                      component={Link} 
                      to="/utilisateur/ajouter"
                      selected={isActive('/utilisateur/ajouter')}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon><Add fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Ajouter" />
                    </ListItem>
                    <ListItem 
                      button 
                      component={Link} 
                      to="/utilisateur/lister"
                      selected={isActive('/utilisateur/lister')}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon><ListIcon fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Lister" />
                    </ListItem>
                  </List>
                </Collapse>

                <ListItem button onClick={() => toggleDropdown('simulations-mobile')}>
                  <ListItemIcon><Science /></ListItemIcon>
                  <ListItemText primary="Simulations" />
                  {openDropdown === 'simulations-mobile' ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openDropdown === 'simulations-mobile'} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem 
                      button 
                      component={Link} 
                      to="/simulations/ajouter"
                      selected={isActive('/simulations/ajouter')}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon><Add fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Ajouter" />
                    </ListItem>
                    <ListItem 
                      button 
                      component={Link} 
                      to="/simulations/explorer"
                      selected={isActive('/simulations/explorer')}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon><School fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Explorer" />
                    </ListItem>
                    <ListItem 
                      button 
                      component={Link} 
                      to="/simulations/all1"
                      selected={isActive('/simulations/all1')}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon><ListIcon fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Toutes" />
                    </ListItem>
                  </List>
                </Collapse>

                <ListItem button onClick={() => toggleDropdown('quizz-mobile')}>
                  <ListItemIcon><Quiz /></ListItemIcon>
                  <ListItemText primary="Gestion Quizz" />
                  {openDropdown === 'quizz-mobile' ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openDropdown === 'quizz-mobile'} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem 
                      button 
                      component={Link} 
                      to="/quizz/ajouter"
                      selected={isActive('/quizz/ajouter')}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon><Add fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Créer" />
                    </ListItem>
                    <ListItem 
                      button 
                      component={Link} 
                      to="/quizz/lister"
                      selected={isActive('/quizz/lister')}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon><ListIcon fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Tous les Quizz" />
                    </ListItem>
                  </List>
                </Collapse>
              </List>
            </Paper>
          </Collapse>
        </StyledAppBar>
      </HideOnScroll>
      
      {/* Espace pour le contenu sous la navbar fixe */}
      <Toolbar sx={{ 
        height: mobileOpen ? 'calc(70px + 56px * 4)' : '70px', // Ajustez en fonction du contenu déplié
        transition: 'height 0.3s ease'
      }} />
    </>
  );
};

export default Navbar;