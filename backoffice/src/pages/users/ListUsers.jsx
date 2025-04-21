import React from 'react';
import { Typography } from '@mui/material';
import { Table } from 'react-bootstrap';
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
    <div className="container my-4">
      <Typography variant="h4" gutterBottom className="text-center">
        Liste des utilisateurs
      </Typography>

      <Table striped bordered hover responsive className="text-center align-middle">
        <thead className="table-success" style={{ backgroundColor: '#21d43f' }}>
          <tr>
            <th>#</th>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Status</th>
            <th>Date de création</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.prenom}</td>
              <td>{user.nom}</td>
              <td>{user.email}</td>
              <td>{user.telephone}</td>
              <td>
                <span className={`badge ${user.status ? 'bg-success' : 'bg-secondary'}`}>
                  {user.status ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td>{new Date(user.dateSys).toLocaleDateString()}</td>
              <td>
                <FaEye className="text-info me-2 cursor-pointer" title="Voir" />
                <FaEdit className="text-primary me-2 cursor-pointer" title="Modifier" />
                <FaTrash className="text-danger cursor-pointer" title="Supprimer" />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ListUsers;
