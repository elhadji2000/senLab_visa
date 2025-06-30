import React, { useEffect, useState } from 'react';
import { getAllSimulations } from '../services/simulationService';
import { Link } from 'react-router-dom';
import { Card, Container, Row, Col, Alert } from 'react-bootstrap';
import './css/AllSimulations.css';

const AllSimulations = () => {
  const [simulations, setSimulations] = useState([]);

  useEffect(() => {
    getAllSimulations()
      .then(data => setSimulations(data))
      .catch(err => console.error("Erreur chargement :", err));
  }, []);

  const categories = ['Mathematique', 'Physique', 'Chimie', 'Biologie'];

  const getByCategorie = (cat) =>
    simulations.filter(sim => sim.categorie.toLowerCase() === cat.toLowerCase());

  return (

    <>
      {/* ✅ Bannière pleine largeur en dehors du Container */}
      <div className="full-width-banner banner-gradient d-flex justify-content-between align-items-center p-4 banner-hover-effect mb-4">
        <div className="banner-text">
          <h2 className="mb-2 display-5 fw-bold">Bienvenue dans le labo virtuel</h2>
          <p className="mb-0 fs-5">Explorez, apprenez, expérimentez !</p>
        </div>
        <img
          src="/src/assets/logo.png"
          alt="Lab"
          className="banner-img floating-animation"
        />
      </div>
      <Container className="mt-4 all-simulations-container">
        {/* Alertes stylisées */}
        <div className="d-flex flex-column">
          <Alert variant="light" className="alert-modern shadow-sm">
            <span className="alert-emoji">💡</span> Une simulation vous aide à mieux comprendre un concept en pratiquant !
          </Alert>
          <Alert variant="light" className="alert-modern shadow-sm">
            <span className="alert-emoji">🧠</span> Essayez plusieurs fois, observez, analysez et tirez vos propres conclusions.
          </Alert>
        </div>

        {/* Liste des simulations par catégorie */}
        {categories.map(categorie => {
          const sims = getByCategorie(categorie);
          if (sims.length === 0) return null;

          return (
            <div key={categorie} className="my-2 category-section">
              <h3 className="mb-4 category-title">
                <span className="category-icon">
                  {categorie === 'Mathematique' && '🧮'}
                  {categorie === 'Physique' && '⚛️'}
                  {categorie === 'Chimie' && '🧪'}
                  {categorie === 'Biologie' && '🧬'}
                </span>
                <span className="category-text">{categorie}</span>
              </h3>

              <Row className="scroll-container pb-3">
                {sims.map(sim => (
                  <Col key={sim._id} xs={10} sm={6} md={4} lg={3} className="mb-2 px-3">
                    <Card className="h-100 sim-card">
                      <Card.Header className="sim-card-header">
                        Lab
                      </Card.Header>
                      <Link to={`/simulations/${sim._id}`} className="text-decoration-none">
                        <Card.Body className="text-center sim-card-body">
                          <div className="image-container-zoom">
                            <img
                              src={`http://localhost:5000${sim.photo}`}
                              alt={sim.titre}
                              onError={(e) => { e.target.src = '/placeholder-science.png' }}
                              className="sim-image img-fluid"
                            />
                          </div>
                          <Card.Title className="mt-3 sim-title">{sim.titre}</Card.Title>
                          <Card.Text className="sim-description">
                            {sim.description}
                          </Card.Text>
                        </Card.Body>
                      </Link>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          );
        })}
      </Container>
    </>
  );
};

export default AllSimulations;