import React, { useState, useContext } from 'react';
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
  Dashboard,
  Settings,
  Assignment,
  Class,
  Key,
  Group,
  BarChart
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';


// Styles personnalisés
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[3],
  transition: 'all 0.3s ease',
  zIndex: theme.zIndex.drawer + 1,
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
  minWidth: 220,
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius,
}));

const UserBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
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

  const hasPermission = (requiredRoles) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  // Récupérer le nom d'affichage de l'utilisateur
  const displayName = user?.name || user?.email?.split('@')[0] || 'Utilisateur';

  return (
    <>
      <CssBaseline />
      <HideOnScroll>
        <StyledAppBar position="fixed">
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{
              display: 'flex',
              justifyContent: 'space-between',
              py: 1,
              minHeight: '64px'
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
                    src="../../src/assets/logoLab.jpg"
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
                    SEN <span style={{ color: 'secondary.main' }}>LAB</span>
                  </Typography>
                </Box>
              </Box>

              {/* Partie centrale - Navigation (version desktop) */}
              <Box sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 1
              }}>
                {/* Dashboard - visible par tous */}
                <NavLink
                  component={Link}
                  to="/dashboard"
                  startIcon={<Home />}
                  active={isActive('/dashboard')}
                >
                  Acceuil
                </NavLink>

                {/* Menu Utilisateur - Admin seulement */}
                {hasPermission(['admin']) && (
                  <Box sx={{ position: 'relative' }}>
                    <NavLink
                      onClick={() => toggleDropdown('user')}
                      startIcon={<Person />}
                      endIcon={openDropdown === 'user' ? <ExpandLess /> : <ExpandMore />}
                      active={isActive('/utilisateur')}
                    >
                      Utilisateurs
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
                            <ListItemText primary="Ajouter utilisateur" />
                          </ListItem>
                          <ListItem
                            button
                            component={Link}
                            to="/utilisateur/lister"
                            selected={isActive('/utilisateur/lister')}
                          >
                            <ListItemIcon><ListIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Liste des utilisateurs" />
                          </ListItem>
                        </List>
                      </DropdownContainer>
                    )}
                  </Box>
                )}

                {/* Menu Formations - Admin + Enseignant */}
                {hasPermission(['admin', 'enseignant']) && (
                  <Box sx={{ position: 'relative' }}>
                    <NavLink
                      component={Link}
                      to="/classe/gerer"
                      startIcon={<Class />}
                      active={isActive('/classe/gerer')}
                    >
                      Classe
                    </NavLink>
                  </Box>
                )}

                {/* Menu Quizz - Admin + Enseignant */}
                {hasPermission(['admin', 'enseignant']) && (
                  <Box sx={{ position: 'relative' }}>
                    <NavLink
                      onClick={() => toggleDropdown('quizz')}
                      startIcon={<Quiz />}
                      endIcon={openDropdown === 'quizz' ? <ExpandLess /> : <ExpandMore />}
                      active={isActive('/quizz')}
                    >
                      Quiz
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
                            <ListItemText primary="Créer un quiz" />
                          </ListItem>
                          <ListItem
                            button
                            component={Link}
                            to="/quizz/lister"
                            selected={isActive('/quizz/lister')}
                          >
                            <ListItemIcon><ListIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Liste des quiz" />
                          </ListItem>
                          <ListItem
                            button
                            component={Link}
                            to="/quizz/resultats"
                            selected={isActive('/quizz/resultats')}
                          >
                            <ListItemIcon><Assignment fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Résultats" />
                          </ListItem>
                        </List>
                      </DropdownContainer>
                    )}
                  </Box>
                )}
                {/* Menu Codes d'accès - Admin + Enseignant */}
                {hasPermission(['admin', 'enseignant']) && (
                  <Box sx={{ position: 'relative' }}>
                     <NavLink
                      component={Link}
                      to="/codes/lister"
                      startIcon={<Key />}
                      active={isActive('/codes/lister')}
                    >
                      Codes d'accés
                    </NavLink>
                  </Box>
                )}
                {/* Menu Élèves - Admin + Enseignant */}
                {hasPermission(['admin', 'enseignant']) && (
                  <Box sx={{ position: 'relative' }}>
                    <NavLink
                      onClick={() => toggleDropdown('eleves')}
                      startIcon={<Group />}
                      endIcon={openDropdown === 'eleves' ? <ExpandLess /> : <ExpandMore />}
                      active={isActive('/eleves')}
                    >
                      Élèves
                    </NavLink>
                    {openDropdown === 'eleves' && (
                      <DropdownContainer>
                        <List dense>
                          <ListItem
                            button
                            component={Link}
                            to="/eleves/lister"
                            selected={isActive('/eleves/lister')}
                          >
                            <ListItemIcon><ListIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Liste des élèves" />
                          </ListItem>
                        </List>
                      </DropdownContainer>
                    )}
                  </Box>
                )}

                {/* Statistiques - optionnel */}
                {hasPermission(['admin', 'enseignant']) && (
                  <Box sx={{ position: 'relative' }}>
                    <NavLink
                      component={Link}
                      to="/statistiques"
                      startIcon={<BarChart />}
                      active={isActive('/statistiques')}
                    >
                      Statistiques
                    </NavLink>
                  </Box>
                )}

                {/* Menu Étudiant - Spécifique aux étudiants */}
                {hasPermission(['etudiant']) && (
                  <>
                    <NavLink
                      component={Link}
                      to="/mes-cours"
                      startIcon={<School />}
                      active={isActive('/mes-cours')}
                    >
                      Mes cours
                    </NavLink>

                    <NavLink
                      component={Link}
                      to="/mes-evaluations"
                      startIcon={<Assignment />}
                      active={isActive('/mes-evaluations')}
                    >
                      Mes évaluations
                    </NavLink>
                  </>
                )}
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
                  sx={{ p: 0 }}
                >
                  <UserBadge>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.main',
                        fontSize: '1rem'
                      }}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography
                      variant="body1"
                      sx={{
                        display: { xs: 'none', md: 'block' },
                        fontWeight: 500,
                        maxWidth: '120px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {displayName}
                    </Typography>
                  </UserBadge>
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
                      minWidth: 200,
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
                    <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
                    <ListItemText>Mon profil</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                    <ListItemText>Paramètres</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                    <ListItemText>Déconnexion</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </Container>

          {/* Menu mobile */}
          <Collapse in={mobileOpen} timeout="auto" unmountOnExit sx={{ display: { md: 'none' } }}>
            <Paper sx={{ py: 1, px: 2, borderRadius: 0 }}>
              <List>
                <ListItem button component={Link} to="/dashboard" selected={isActive('/dashboard')}>
                  <ListItemIcon><Dashboard /></ListItemIcon>
                  <ListItemText primary="Tableau de bord" />
                </ListItem>

                {/* Menu Utilisateur mobile - Admin seulement */}
                {hasPermission(['admin']) && (
                  <>
                    <ListItem button onClick={() => toggleDropdown('user-mobile')}>
                      <ListItemIcon><Person /></ListItemIcon>
                      <ListItemText primary="Utilisateurs" />
                      {openDropdown === 'user-mobile' ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openDropdown === 'user-mobile'} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem
                          button
                          component={Link}
                          to="/utilisateurs/ajouter"
                          selected={isActive('/utilisateurs/ajouter')}
                          sx={{ pl: 4 }}
                        >
                          <ListItemIcon><Add fontSize="small" /></ListItemIcon>
                          <ListItemText primary="Ajouter" />
                        </ListItem>
                        <ListItem
                          button
                          component={Link}
                          to="/utilisateurs/liste"
                          selected={isActive('/utilisateurs/liste')}
                          sx={{ pl: 4 }}
                        >
                          <ListItemIcon><ListIcon fontSize="small" /></ListItemIcon>
                          <ListItemText primary="Liste" />
                        </ListItem>
                      </List>
                    </Collapse>
                  </>
                )}

                {/* Menu Formations mobile - Admin + Enseignant */}
                {hasPermission(['admin', 'enseignant']) && (
                  <>
                    <ListItem button onClick={() => toggleDropdown('formations-mobile')}>
                      <ListItemIcon><Class /></ListItemIcon>
                      <ListItemText primary="Formations" />
                      {openDropdown === 'formations-mobile' ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openDropdown === 'formations-mobile'} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem
                          button
                          component={Link}
                          to="/formations/creer"
                          selected={isActive('/formations/creer')}
                          sx={{ pl: 4 }}
                        >
                          <ListItemIcon><Add fontSize="small" /></ListItemIcon>
                          <ListItemText primary="Créer" />
                        </ListItem>
                        <ListItem
                          button
                          component={Link}
                          to="/formations/gerer"
                          selected={isActive('/formations/gerer')}
                          sx={{ pl: 4 }}
                        >
                          <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                          <ListItemText primary="Gérer" />
                        </ListItem>
                      </List>
                    </Collapse>
                  </>
                )}

                {/* Menu Quizz mobile - Admin + Enseignant */}
                {hasPermission(['admin', 'enseignant']) && (
                  <>
                    <ListItem button onClick={() => toggleDropdown('quizz-mobile')}>
                      <ListItemIcon><Quiz /></ListItemIcon>
                      <ListItemText primary="Évaluations" />
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
                          <ListItemText primary="Liste" />
                        </ListItem>
                        <ListItem
                          button
                          component={Link}
                          to="/quizz/resultats"
                          selected={isActive('/quizz/resultats')}
                          sx={{ pl: 4 }}
                        >
                          <ListItemIcon><Assignment fontSize="small" /></ListItemIcon>
                          <ListItemText primary="Résultats" />
                        </ListItem>
                      </List>
                    </Collapse>
                  </>
                )}

                {/* Menu Étudiant mobile */}
                {hasPermission(['etudiant']) && (
                  <>
                    <ListItem
                      button
                      component={Link}
                      to="/mes-cours"
                      selected={isActive('/mes-cours')}
                    >
                      <ListItemIcon><School /></ListItemIcon>
                      <ListItemText primary="Mes cours" />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/mes-evaluations"
                      selected={isActive('/mes-evaluations')}
                    >
                      <ListItemIcon><Assignment /></ListItemIcon>
                      <ListItemText primary="Mes évaluations" />
                    </ListItem>
                  </>
                )}
              </List>
            </Paper>
          </Collapse>
        </StyledAppBar>
      </HideOnScroll>

      {/* Espace pour le contenu sous la navbar fixe */}
      <Toolbar sx={{
        height: mobileOpen ? 'calc(64px + 56px * 4)' : '64px',
        transition: 'height 0.3s ease'
      }} />
    </>
  );
};

export default Navbar;