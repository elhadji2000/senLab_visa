import React, { useEffect, useState } from "react";
import { fetchUsers, toggleUserStatus } from "../../api/users.api";
import { useNavigate } from "react-router-dom";
import { Table, Button, Spinner } from "react-bootstrap";
import {
  FaUserEdit,
  FaToggleOn,
  FaToggleOff,
  FaUserPlus,
} from "react-icons/fa";
import "./ListUsers.css";

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // 🔄 Pour montrer un spinner par utilisateur
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetchUsers();
      const usersWithId = res.data.map((u) => ({ ...u, id: u._id }));
      // 🔹 Tri côté frontend par nom puis prénom (au cas où l'API ne le fait pas déjà)
      usersWithId.sort((a, b) => {
        if (a.nom === b.nom) return a.prenom.localeCompare(b.prenom);
        return a.nom.localeCompare(b.nom);
      });
      setUsers(usersWithId);
    } catch (error) {
      console.error("Erreur chargement utilisateurs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setUpdatingId(id); // 🟡 Indique qu’on est en train de modifier ce user
      await toggleUserStatus(id, !currentStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: !currentStatus } : u))
      );
    } catch (err) {
      console.error("Erreur lors du changement de statut", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/users/edit/${id}`);
  };

  const handleAdd = () => {
    navigate("/utilisateur/ajouter");
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>👥 Gestion des Utilisateurs</h4>
        <Button variant="success" onClick={handleAdd}>
          <FaUserPlus className="me-2" />
          Ajouter
        </Button>
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table
          bordered
          hover
          responsive
          className="align-middle text-center shadow-sm"
        >
          <thead className="table-light">
            <tr>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>
                    {user.prenom.charAt(0).toUpperCase() +
                      user.prenom.slice(1).toLowerCase()}
                  </td>
                  <td>{user.nom.toLowerCase()}</td>
                  <td>{user.email}</td>
                  <td>{user.telephone}</td>
                  <td>
                    <strong>{user.role}</strong>
                  </td>
                  <td
                    className={
                      user.status
                        ? "text-success fw-bold"
                        : "text-muted fw-bold"
                    }
                  >
                    {user.status ? "✅ Actif" : "❌ Inactif"}
                  </td>
                  <td className="d-flex justify-content-center gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="action-btn"
                      onClick={() => handleEdit(user.id)}
                    >
                      <FaUserEdit className="me-1" /> Modifier
                    </Button>
                    <Button
                      variant={
                        user.status ? "outline-danger" : "outline-success"
                      }
                      size="sm"
                      className="action-btn"
                      disabled={updatingId === user.id} // 🔄 Désactive pendant la requête
                      onClick={() => handleToggleStatus(user.id, user.status)}
                    >
                      {updatingId === user.id ? (
                        <Spinner animation="border" size="sm" />
                      ) : user.status ? (
                        <>
                          <FaToggleOff className="me-1" /> Désactiver
                        </>
                      ) : (
                        <>
                          <FaToggleOn className="me-1" /> Activer
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ListUsers;
