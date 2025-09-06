/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ButtonGroup,
  Button,
  Dropdown,
} from "react-bootstrap";
import {
  PeopleFill,
  JournalBookmark,
  ClipboardData,
  Key,
  GraphUp,
  GearFill,
  BellFill,
  PersonCircle,
} from "react-bootstrap-icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { fetchDashboard } from "../../api/student.api";
import { fetchDashboardResultats } from "../../api/student.api";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dashboard, setDashboard] = useState(null);
  const [dashboardResultats, setDashboardResultats] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetchDashboard();
        const res2 = await fetchDashboardResultats();
        setDashboard(res.data ?? res);
        setDashboardResultats(res2.data ?? res2);
      } catch (err) {
        setError("Impossible de charger le dashboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return <div>Chargement des données...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (!dashboard) {
    return <div>Aucune donnée disponible</div>;
  }

  const { stats = {} } = dashboard;

  // Exemple de données pour évolution des utilisateurs
  // Tu peux remplacer par ce qui vient de ton API
  const userEvolutionData = [
    { mois: "Jan", users: 20 },
    { mois: "Fév", users: 35 },
    { mois: "Mar", users: 50 },
    { mois: "Avr", users: 70 },
    { mois: "Mai", users: 90 },
    { mois: "Juin", users: stats?.totalUsers ?? 100 },
  ];

  return (
    <Container fluid className="px-4 py-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <h1 className="h2">Tableau de Bord Administrateur</h1>
          <p className="mb-0 text-muted">
            Bienvenue, voici un aperçu de l’activité des utilisateurs.
          </p>
        </Col>
        <Col md={6} className="d-flex justify-content-end">
          <ButtonGroup>
            <Button variant="outline-secondary" size="sm">
              <BellFill className="me-2" /> Notifications
            </Button>
            <Button variant="outline-secondary" size="sm">
              <GearFill className="me-2" /> Paramètres
            </Button>
            <Dropdown>
              <Dropdown.Toggle variant="light" size="sm" id="profile-dropdown">
                <PersonCircle className="me-2" /> Mon compte
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Profil</Dropdown.Item>
                <Dropdown.Item>Déconnexion</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4 g-4">
        <Col xl={3} lg={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Classes Actives</h6>
                  <h3 className="mb-0">{stats?.totalClasses ?? 0}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <JournalBookmark size={24} className="text-primary" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Élèves Inscrits</h6>
                  <h3 className="mb-0">{stats?.totalEleves ?? 0}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <PeopleFill size={24} className="text-success" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Évaluations</h6>
                  <h3 className="mb-0">{stats?.totalCodeClasses ?? 0}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <ClipboardData size={24} className="text-warning" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Utilisateurs</h6>
                  <h3 className="mb-0">{stats?.totalUsers ?? 0}</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <GraphUp size={24} className="text-info" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Evolution des utilisateurs */}
      <Row className="g-4">
        <Col lg={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Évolution des Utilisateurs</h5>
            </Card.Header>
            <Card.Body style={{ height: "350px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userEvolutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#0d6efd"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
