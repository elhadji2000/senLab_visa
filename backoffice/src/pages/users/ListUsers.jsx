import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Avatar,
  Chip,
  Box,
  LinearProgress,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  Grid,
  useMediaQuery,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  CircularProgress // Ajoutez cette ligne
} from '@mui/material';

import {
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';

// Styles personnalisés
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 'bold',
  backgroundColor: status === 'true'
    ? theme.palette.success.light
    : theme.palette.error.light,
  color: status === 'true'
    ? theme.palette.success.contrastText
    : theme.palette.error.contrastText,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
}));

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs :", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.telephone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const roles = [...new Set(users.map(user => user.role))];

  // Composant pour l'affichage mobile
  const MobileUserCard = ({ user, index }) => (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 48,
              height: 48,
              mr: 2
            }}
            src={user.avatar}
          >
            {user.prenom?.charAt(0).toUpperCase()}{user.nom?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {user.prenom} {user.nom}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Rôle:</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Chip
              label={user.role}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Téléphone:</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              {user.telephone || '-'}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Statut:</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <StatusChip
              status={user.status}
              label={user.status === true ? 'Actif' : 'Inactif'}
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Créé le:</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: frLocale })}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      <CardActions sx={{ justifyContent: 'space-around', p: 1 }}>
        <Tooltip title="Voir détails">
          <IconButton size="small" color="info">
            <FaEye />
          </IconButton>
        </Tooltip>
        <Tooltip title="Modifier">
          <IconButton size="small" color="primary">
            <FaEdit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Supprimer">
          <IconButton size="small" color="error">
            <FaTrash />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          mb: 4,
          color: 'primary.main',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 1,
          fontSize: isMobile ? '1.5rem' : '2rem'
        }}
      >
        Gestion des Utilisateurs
      </Typography>

      {/* Filtres de recherche */}
      <Paper elevation={3} sx={{ p: isMobile ? 2 : 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size={isMobile ? 'small' : 'medium'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                displayEmpty
              >
                <MenuItem value="all">Tous les rôles</MenuItem>
                {roles.map(role => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
              >
                <MenuItem value="all">Tous les statuts</MenuItem>
                <MenuItem value="true">Actifs</MenuItem>
                <MenuItem value="false">Inactifs</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : isMobile ? (
        // Version mobile
        <Box>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <MobileUserCard key={user.id} user={user} index={index} />
            ))
          ) : (
            <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
              Aucun utilisateur trouvé
            </Typography>
          )}
        </Box>
      ) : (
        // Version desktop
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'primary.main',
              borderRadius: '4px',
            },
          }}
        >
          <Table stickyHeader aria-label="table of users">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">#</StyledTableCell>
                <StyledTableCell align="center">Avatar</StyledTableCell>
                <StyledTableCell align="center">Nom Complet</StyledTableCell>
                <StyledTableCell align="center">Email</StyledTableCell>
                <StyledTableCell align="center">Rôle</StyledTableCell>
                <StyledTableCell align="center">Téléphone</StyledTableCell>
                <StyledTableCell align="center">Statut</StyledTableCell>
                <StyledTableCell align="center">Date Création</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <StyledTableRow key={user.id}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">
                      <Tooltip title={`${user.prenom} ${user.nom}`}>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            margin: 'auto',
                            width: 40,
                            height: 40,
                            fontSize: '1rem'
                          }}
                          src={user.avatar}
                        >
                          {user.prenom?.charAt(0).toUpperCase()}{user.nom?.charAt(0).toUpperCase()}
                        </Avatar>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontWeight="medium">
                        {user.prenom} {user.nom}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{user.email}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={user.role}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">{user.telephone || '-'}</TableCell>
                    <TableCell align="center">
                      <StatusChip
                        status={user.status}
                        label={user.status === 'true' ? 'Actif' : 'Inactif'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: frLocale })}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Voir détails" arrow>
                          <IconButton color="info" size="small">
                            <FaEye />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifier" arrow>
                          <IconButton color="primary" size="small">
                            <FaEdit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer" arrow>
                          <IconButton color="error" size="small">
                            <FaTrash />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      Aucun utilisateur trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="body2" color="text.secondary">
            {filteredUsers.length} utilisateur(s) trouvé(s)
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ListUsers;