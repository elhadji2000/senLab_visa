/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert, ButtonGroup } from "react-bootstrap";
import { fetchClasseById, deleteClass } from "../../../api/classes";
import { FaEdit, FaTrash, FaUsers, FaClipboardList, FaCode } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClassStudentsSection from "../../../components/classes/ClassStudentsSection";
import ClassEvaluationSection from "../../../components/classes/ClassEvaluationSection";
import ClassCodeSection from "../../../components/classes/ClassCodeSection";
import ClassInfoSidebar from "../../../components/classes/ClassInfoSidebar";
import DeleteClassModal from "../../../components/classes/DeleteClassModal";

const ClasseDetails = () => {
  const { id } = useParams();
  const [classe, setClasse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("eleves");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadClassData = async () => {
    try {
      setLoading(true);
      const res = await fetchClasseById(id);
      setClasse(res.data);
    } catch (err) {
      setError("Erreur lors du chargement de la classe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClassData();
  }, [id]);

  const handleDeleteClass = async () => {
    try {
      await deleteClass(classe.classe?._id);
      toast.success("Classe supprimée avec succès !");
      setShowDeleteModal(false);
      // Redirection après suppression
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container fluid  className="py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Row>
        {/* Colonne principale */}
        <Col lg={9}>
          {/* En-tête de la classe */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h4 className="text-primary mb-2">{classe.classe?.nom_classe}</h4>
              <p className="text-muted mb-1">
                <strong>Niveau :</strong> {classe.classe?.niveau} |{" "}
                <strong>Année :</strong> {classe.classe?.annee_scolaire}
              </p>
              
              <div className="d-flex flex-wrap gap-2 mt-3">
                <ButtonGroup>
                  <Button
                    variant={activeSection === "eleves" ? "primary" : "outline-primary"}
                    onClick={() => setActiveSection("eleves")}
                  >
                    <FaUsers className="me-1" /> Élèves
                  </Button>
                  <Button
                    variant={activeSection === "evaluations" ? "primary" : "outline-primary"}
                    onClick={() => setActiveSection("evaluations")}
                  >
                    <FaClipboardList className="me-1" /> Évaluations
                  </Button>
                  <Button
                    variant={activeSection === "code" ? "primary" : "outline-primary"}
                    onClick={() => setActiveSection("code")}
                  >
                    <FaCode className="me-1" /> Codes
                  </Button>
                </ButtonGroup>

                <Button variant="outline-warning">
                  <FaEdit /> Modifier
                </Button>
                <Button 
                  variant="outline-danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <FaTrash /> Supprimer
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Contenu dynamique */}
          {activeSection === "eleves" && <ClassStudentsSection classId={id} />}
          {activeSection === "evaluations" && <ClassEvaluationSection classId={id} />}
          {activeSection === "code" && <ClassCodeSection classId={id} />}
        </Col>

        {/* Colonne latérale */}
        <Col lg={3}>
          <ClassInfoSidebar 
            classData={classe.classe} 
            studentCount={classe.eleves?.length || 0} 
          />
        </Col>
      </Row>

      {/* Modal de suppression */}
      <DeleteClassModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        className={classe.classe?.nom_classe}
        onDelete={handleDeleteClass}
      />
    </Container>
  );
};

export default ClasseDetails;