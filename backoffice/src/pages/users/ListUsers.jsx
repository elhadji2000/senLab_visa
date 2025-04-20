import React from 'react';
import { Typography } from '@mui/material';
import { Table } from 'react-bootstrap';

const ListUsers = () => {
  const users = [
    { id: 1, nom: 'Ali', email: 'ali@mail.com' },
    { id: 2, nom: 'Fatou', email: 'fatou@mail.com' },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>Liste des utilisateurs</Typography>
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Username</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Diop</td>
          <td>Madiop</td>
          <td>@twitter</td>
        </tr>
      </tbody>
    </Table>
    </div>
  );
};

export default ListUsers;
