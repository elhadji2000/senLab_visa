/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Card,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import { FaUserPlus, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa";
import {
  fetchElevesByClasse,
  deleteEleve,
  importElevesFromExcel,
} from "../../api/student.api";
import { toast } from "react-toastify";
import AjouterElevesTable from "../../pages/professeur/eleves/AjouterElevesTable";
import moment from "moment";

const ClassStudentsSection = ({ classId }) => {
  const navigate = useNavigate();
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEleve, setSelectedEleve] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false); // modal excel
  const [excelFile, setExcelFile] = useState(null);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await fetchElevesByClasse(classId);

      const sorted = res.data.eleves.sort((a, b) => {
        if (a.nom === b.nom) return a.prenom.localeCompare(b.prenom);
        return a.nom.localeCompare(b.nom);
      });

      setEleves(sorted);
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
  const handleEditClick = (eleve) => {
    setSelectedEleve(eleve); // on remplit avec l'élève sélectionné
    setShowAddModal(true); // on ouvre le modal
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    loadStudents();
    toast.success("Élèves ajoutés avec succès !");
  };

  // Gestion de l'upload Excel
  const handleExcelUpload = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleExcelSubmit = async () => {
    if (!excelFile) return toast.error("Veuillez choisir un fichier Excel !");
    const formData = new FormData();
    formData.append("file", excelFile);
    formData.append("classId", classId);

    try {
      await importElevesFromExcel(formData);
      setShowExcelModal(false);
      setExcelFile(null);
      loadStudents();
      toast.success("Élèves importés depuis Excel avec succès !");
    } catch (err) {
      toast.error("Erreur lors de l'importation Excel");
    }
  };

  return (
    <>
      <style>
        {`
    .custom-table th,
    .custom-table td {
      font-size: 14px;         /* police  */
      padding: 4px 6px;        /* padding */
      vertical-align: middle;  /* centre verticalement */
    }

    .custom-table .badge {
      font-size: 11px;         /* badge plus petit */
      padding: 2px 4px;
    }

    .custom-table .btn-sm {
      font-size: 12px;         /* boutons plus petits */
      padding: 2px 6px;
    }
  `}
      </style>

      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-light d-flex justify-content-between align-items-center">
          <strong>Liste des élèves ({eleves.length})</strong>
          <div>
            <Button
              size="sm"
              variant="success"
              className="me-2"
              onClick={() => setShowAddModal(true)}
            >
              <FaUserPlus className="me-1" /> Ajouter
            </Button>
            <Button
              size="sm"
              variant="info"
              onClick={() => setShowExcelModal(true)}
            >
              <FaFileExcel className="me-1" /> Importer Excel
            </Button>
          </div>
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
            <Table responsive hover className="mb-0 custom-table">
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
                    <td>{e.nom.toUpperCase()}</td>
                    <td>{e.prenom}</td>
                    <td>{moment(e.date_naissance).format("DD/MM/YYYY")}</td>
                    <td>{e.email}</td>
                    <td>{e.telephone || "N/A"}</td>
                    <td>
                      {/* <Button size="sm" variant="outline-warning" className="me-2"><FaEdit /></Button> */}
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(e._id)}
                      >
                        <FaTrash />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-warning"
                        className="m-1"
                        onClick={() => handleEditClick(e)}
                      >
                        <FaEdit />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>

        {/* Modal pour l'ajout manuel */}
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
              classId={classId}
              eleveToEdit={selectedEleve} // <- important
              onSuccess={() => {
                loadStudents(); // recharge la liste
                setShowAddModal(false); // ferme modal
                setSelectedEleve(null); // à la fin on reset
              }}
              onCancel={() => {
                setShowAddModal(false);
                setSelectedEleve(null);
              }}
            />
          </Modal.Body>
        </Modal>

        {/* Modal pour l'import Excel */}
        <Modal
          show={showExcelModal}
          onHide={() => setShowExcelModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Importer des élèves depuis Excel</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>
                  Choisir le fichier Excel (.xlsx ou .csv)
                </Form.Label>
                <Form.Control
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleExcelUpload}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleExcelSubmit}>
                Importer
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Card>
    </>
  );
};

export default ClassStudentsSection;
