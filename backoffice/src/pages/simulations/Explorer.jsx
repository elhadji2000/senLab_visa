/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchSimulations, deleteSimulation } from "../../api/simulationAPI";
import "./Explorer.css";

const ExplorerBackoffice = () => {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadSimulations = async () => {
      try {
        const response = await fetchSimulations();
        setSimulations(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des simulations.");
      } finally {
        setLoading(false);
      }
    };
    loadSimulations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette simulation ?"))
      return;
    try {
      await deleteSimulation(id);
      setSimulations(simulations.filter((sim) => sim._id !== id));
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary">📁 Gestion des Simulations</h3>
        <Button
          variant="warning"
          onClick={() => navigate("/simulations/ajouter")}
        >
          + Ajouter une Simulation
        </Button>
      </div>

      {/* Si aucune simulation */}
      {simulations.length === 0 ? (
        <Row className="justify-content-center mt-5">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card className="text-center shadow-sm border-0">
              <Card.Body>
                <Card.Title className="text-muted">
                  😕 Aucune simulation ajoutée pour le moment
                </Card.Title>
                <Card.Text>
                  Cliquez sur <strong>+ Ajouter une Simulation</strong> pour en
                  créer une.
                </Card.Text>
                <Button
                  variant="warning"
                  onClick={() => navigate("/simulations/ajouter")}
                >
                  Ajouter une Simulation
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row xs={1} sm={2} md={3} lg={5} className="g-3">
          {simulations.map((sim, index) => (
            <Col key={sim._id}>
              <Card className="sim-card h-100 border-0">
                {/* Header */}
                <Card.Header className="sim-card-header text-center">
                  #{index + 1}
                </Card.Header>

                {/* Contenu */}
                <Card.Body className="d-flex flex-column text-center p-2">
                  {/* Image */}
                  <div className="mb-2">
                    <Card.Img
                      src={`http://localhost:5000${sim.photo}`}
                      alt={sim.titre}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x150?text=Image+non+disponible";
                      }}
                      className="sim-image"
                    />
                  </div>

                  {/* Description */}
                  <Card.Text className="flex-grow-1 sim-description">
                    {sim.titre || "Pas de titre disponible"}
                  </Card.Text>

                  {/* Badges */}
                  <div className="mb-2">
                    <span className="sim-badge">{sim.categorie}</span>
                    <span className="sim-badge">{sim.niveau}</span>
                  </div>

                  {/* Actions */}
                  <div className="sim-actions d-flex justify-content-center gap-2 mt-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/simulations/view/${sim._id}`)}
                    >
                      Voir
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => navigate(`/simulations/edit/${sim._id}`)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(sim._id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ExplorerBackoffice;
