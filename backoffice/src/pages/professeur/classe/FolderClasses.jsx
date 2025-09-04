/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchClasses } from "../../../api/classes";
import { createClass, updateClass } from "../../../api/classes";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Tooltip,
  OverlayTrigger,
  Button,
  Card,
} from "react-bootstrap";
import { FaFolderOpen } from "react-icons/fa";
import ClasseModal from "./ClasseModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./FolderClasses.css";

const FolderClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetchClasses();
      setClasses(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClick = (id) => {
    navigate(`/classes/${id}/details`);
  };

  const handleOpenAdd = () => {
    setEditData(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEdit = (classe) => {
    setEditData(classe);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = async (data) => {
    try {
      if (isEditing && editData) {
        await updateClass(editData._id, data);
        toast.success("Classe modifiée avec succès.");
      } else {
        await createClass(data);
        toast.success("Classe ajoutée avec succès.");
      }
      setShowModal(false);
      await loadData(); // Rafraîchir
    } catch (error) {
      console.error("Erreur lors de la sauvegarde", error);
      toast.error("Erreur lors de l'enregistrement.");
    }
  };

  return (
    <Container className="py-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
      <h3 className="text-primary mb-4 fw-bold">📁 Mes classes</h3>

      <div className="d-flex justify-content-end mb-3">
        <Button onClick={handleOpenAdd} variant="success" className="shadow-sm">
          ➕ Ajouter une classe
        </Button>
      </div>

      <ClasseModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSave}
        initialData={editData}
        isEditing={isEditing}
      />

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "60vh" }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : classes.length === 0 ? (
        <Alert variant="info" className="text-center">
          Vous n'avez aucune classe pour le moment. Cliquez sur{" "}
          <strong>Ajouter une classe</strong> pour en créer une.
        </Alert>
      ) : (
        <Row>
          <Col md={9}>
            <Row xs={2} sm={3} md={4} lg={5} xl={6} className="g-4">
              {classes.map((classe) => (
                <Col key={classe._id}>
                  <div
                    className="folder-card"
                    onClick={() => handleClick(classe._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <OverlayTrigger
                      overlay={
                        <Tooltip>
                          Cliquer pour voir les détails de{" "}
                          <strong>{classe.nom_classe}</strong>
                        </Tooltip>
                      }
                    >
                      <div className="folder-icon-wrapper">
                        <FaFolderOpen className="folder-icon" />
                      </div>
                    </OverlayTrigger>
                    <div className="folder-label">
                      <div className="fw-bold">{classe.nom_classe}</div>
                      <div className="text-muted small">{classe.niveau}</div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>

          <Col md={3} className="ps-md-4 mt-4 mt-md-0">
            <h5 className="mb-3">Infos utiles</h5>

            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>Rappel</Card.Title>
                <Card.Text>
                  N’oubliez pas d’ajouter vos classes régulièrement pour mieux
                  organiser vos élèves et évaluations.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>Conseil</Card.Title>
                <Card.Text>
                  Cliquez sur une classe pour gérer ses détails, modifier ou
                  supprimer.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default FolderClasses;
