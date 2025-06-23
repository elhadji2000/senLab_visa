import React, { useEffect, useState } from 'react';
import { fetchUsers, deleteUser } from '../../api/users.api';
import { useNavigate } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Charger la liste des utilisateurs au chargement du composant
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetchUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression de cet utilisateur ?')) return;

    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      console.error('Erreur de suppression', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/users/edit/${id}`);
  };

  const handleAdd = () => {
    navigate('/utilisateur/ajouter');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Liste des utilisateurs</h3>
        <Button variant="success" onClick={handleAdd}>
          ➕ Ajouter un utilisateur
        </Button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : users.length === 0 ? (
        <p>Aucun utilisateur trouvé.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Statut</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.nom}</td>
                <td>{u.prenom}</td>
                <td>{u.email}</td>
                <td>{u.telephone}</td>
                <td>
                  {u.status ? (
                    <span className="badge bg-success">Actif</span>
                  ) : (
                    <span className="badge bg-secondary">Inactif</span>
                  )}
                </td>
                <td>{u.role}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(u._id)}
                  >
                    ✏️ Modifier
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(u._id)}
                  >
                    🗑️ Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ListUsers;
