import React, { useEffect, useState } from 'react';
import { fetchUsers, toggleUserStatus } from '../../api/users.api'; // ➕ API update
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaPowerOff, FaToggleOn, FaToggleOff, FaUserPlus, FaUserCircle } from 'react-icons/fa';
import { Button, Spinner } from 'react-bootstrap';
import './ListUsers.css'; // ➕ Ajoute une feuille de style personnalisée

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetchUsers();
      setUsers(res.data);
    } catch (error) {
      console.error('Erreur chargement utilisateurs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await toggleUserStatus(id, !currentStatus);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status: !currentStatus } : u))
      );
    } catch (err) {
      console.error('Erreur lors du changement de statut', err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/users/edit/${id}`);
  };

  const handleAdd = () => {
    navigate('/utilisateur/ajouter');
  };

  return (
    <div className="user-container container">
      <div className="user-header">
        <h2>👥 Gestion des Utilisateurs</h2>
        <Button variant="success" onClick={handleAdd}>
          <FaUserPlus className="me-2" /> Ajouter
        </Button>
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : users.length === 0 ? (
        <p>Aucun utilisateur trouvé.</p>
      ) : (
        <div className="user-grid">
          {users.map((u) => (
            <div key={u._id} className={`user-card ${u.status ? 'active' : 'inactive'}`}>
              <div className="user-icon">
                <FaUserCircle size={40} />
              </div>
              <div className="user-info">
                <h5>{u.nom} {u.prenom}</h5>
                <p>{u.email}</p>
                <p>Tél: {u.telephone}</p>
                <span className={`badge ${u.status ? 'bg-success' : 'bg-secondary'}`}>
                  {u.status ? 'Actif' : 'Inactif'}
                </span>
                <span className="badge bg-info ms-2">{u.role}</span>
              </div>
              <div className="user-actions">
                <Button variant="outline-warning" size="sm" onClick={() => handleEdit(u._id)}>
                  <FaUserEdit /> Modifier
                </Button>
                <Button
                  variant={u.status ? 'outline-danger' : 'outline-success'}
                  size="sm"
                  onClick={() => handleToggleStatus(u._id, u.status)}
                  className="ms-2"
                >
                  {u.status ? <FaToggleOff /> : <FaToggleOn />} {u.status ? 'Désactiver' : 'Activer'}
                </Button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListUsers;
