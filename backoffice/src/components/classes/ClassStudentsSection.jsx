import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Card, Button, Spinner, Alert, Modal } from "react-bootstrap";
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import { fetchElevesByClasse, deleteEleve } from "../../api/student.api";
import { toast } from "react-toastify";
import AjouterElevesTable from "../../pages/professeur/eleves/AjouterElevesTable"; // Importez votre composant
import moment from "moment";

const ClassStudentsSection = ({ classId }) => {
  const navigate = useNavigate();
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false); // Nouvel état pour le modal

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await fetchElevesByClasse(classId);
      setEleves(res.data.eleves);
    } catch (err) {
      setError("Erreur lors du chargement des élèves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [classId]);

  const handleDelete = async (eleveId) => {
    if (!window.confirm("Confirmer la suppression de cet élève ?")) return;

    try {
      await deleteEleve(eleveId);
      setEleves((prev) => prev.filter((e) => e._id !== eleveId));
      toast.success("Élève supprimé avec succès !");
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    loadStudents(); // Recharge la liste après ajout
    toast.success("Élèves ajoutés avec succès !");
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <strong>Liste des élèves ({eleves.length})</strong>
        <Button
          size="sm"
          variant="success"
          onClick={() => setShowAddModal(true)}
        >
          <FaUserPlus className="me-1" /> Ajouter
        </Button>
      </Card.Header>

      <Card.Body className="p-0">
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : eleves.length === 0 ? (
          <div className="text-center p-4 text-muted">
            Aucun élève dans cette classe
          </div>
        ) : (
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Date Naissance</th>
                <th>Email</th>
                <th>Telephone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {eleves.map((e, idx) => (
                <tr key={e._id}>
                  <td>{idx + 1}</td>
                  <td>{e.nom}</td>
                  <td>{e.prenom}</td>
                  <td>{moment(e.date_naissance).format("DD/MM/YYYY")}</td>
                  <td>{e.email}</td>
                  <td>{e.telephone || "N/A"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-warning"
                      className="me-2"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(e._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>

      {/* Modal pour l'ajout d'élèves */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Ajouter des élèves</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AjouterElevesTable
            classId={classId} // Passez l'ID de classe comme prop
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default ClassStudentsSection;
