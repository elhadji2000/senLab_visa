import React from 'react';
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
  Box
} from '@mui/material';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const ListUsers = () => {
  const users = [
    {
      id: 1,
      prenom: 'Ali',
      nom: 'Sow',
      email: 'ali@mail.com',
      telephone: '77889900',
      status: true,
      dateSys: '2024-04-01',
    },
    {
      id: 2,
      prenom: 'Fatou',
      nom: 'Diouf',
      email: 'fatou@mail.com',
      telephone: '77445522',
      status: false,
      dateSys: '2024-04-15',
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Liste des utilisateurs
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#21d43f' }}>
            <TableRow>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>#</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Avatar</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Prénom</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Nom</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Téléphone</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Créé le</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id} hover>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">
                  <Avatar sx={{ bgcolor: '#2196f3', margin: 'auto' }}>
                    {user.prenom.charAt(0).toUpperCase()}
                  </Avatar>
                </TableCell>
                <TableCell align="center">{user.prenom}</TableCell>
                <TableCell align="center">{user.nom}</TableCell>
                <TableCell align="center">{user.email}</TableCell>
                <TableCell align="center">{user.telephone}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={user.status ? 'Actif' : 'Inactif'}
                    color={user.status ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {new Date(user.dateSys).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <IconButton color="info" title="Voir">
                    <FaEye />
                  </IconButton>
                  <IconButton color="primary" title="Modifier">
                    <FaEdit />
                  </IconButton>
                  <IconButton color="error" title="Supprimer">
                    <FaTrash />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ListUsers;
