import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchSimulations, deleteSimulation } from '../../api/simulationAPI';
import './Explorer.css';

const ExplorerBackoffice = () => {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
    if (!window.confirm("Voulez-vous vraiment supprimer cette simulation ?")) return;
    try {
      await deleteSimulation(id);
      setSimulations(simulations.filter(sim => sim._id !== id));
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary">📁 Gestion des Simulations</h3>
        <Button variant="warning" onClick={() => navigate('/simulations/add')}>
          + Ajouter une Simulation
        </Button>
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {simulations.map(sim => (
          <Col key={sim._id}>
            <Card className="sim-card h-100 border-0">
              <Card.Header className="sim-card-header bg-warning text-white text-center">
                {sim.titre}
              </Card.Header>
              <Card.Body className="d-flex flex-column text-center">
                <div className="image-container-zoom mb-3">
                  <Card.Img
                    src={`http://localhost:5000${sim.photo}`}
                    alt={sim.titre}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200?text=Image+non+disponible';
                    }}
                    className="sim-image img-fluid"
                  />
                </div>
                <Card.Text className="flex-grow-1 sim-description">
                  {sim.description?.substring(0, 100)}...
                </Card.Text>
                <div className="mb-2">
                  <span className="badge bg-secondary me-1">{sim.categorie}</span>
                  <span className="badge bg-info">{sim.niveau}</span>
                </div>
                <div className="d-flex justify-content-center gap-2 mt-3">
                  <Button variant="outline-primary" size="sm" onClick={() => navigate(`/simulations/view/${sim._id}`)}>
                    Voir
                  </Button>
                  <Button variant="outline-success" size="sm" onClick={() => navigate(`/simulations/edit/${sim._id}`)}>
                    Modifier
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(sim._id)}>
                    Supprimer
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ExplorerBackoffice;