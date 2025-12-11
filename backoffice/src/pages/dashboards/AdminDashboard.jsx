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
  GraphUp,
  GearFill,
  BellFill,
  PersonCircle,
} from "react-bootstrap-icons";

import axios from "axios"; //  Important
import {
  fetchDashboard,
  fetchDashboardResultats,
} from "../../api/student.api";
import { fetchStats } from "../../api/users.api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingEvolution, setLoadingEvolution] = useState(true);

  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [dashboardResultats, setDashboardResultats] = useState(null);
  const [userEvolutionData, setUserEvolutionData] = useState([]);

  // -----------------------------------
  //  CHARGER LES INFOS DU DASHBOARD
  // -----------------------------------
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetchDashboard();
        const res2 = await fetchDashboardResultats();

        setDashboard(res.data || res);
        setDashboardResultats(res2.data || res2);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger le dashboard.");
      } finally {
        setLoadingDashboard(false);
      }
    };

    loadDashboard();
  }, []);

  // -----------------------------------
  //  CHARGER L’EVOLUTION DES UTILISATEURS
  // -----------------------------------
  useEffect(() => {
    const fetchEvolution = async () => {
      try {
        const response = await fetchStats();

        const formatted = response.data.map((item) => ({
          mois: new Date(2024, item.mois - 1).toLocaleString("fr-FR", {
            month: "short",
          }),
          users: item.users,
        }));

        setUserEvolutionData(formatted);
      } catch (err) {
        console.error("Erreur récupération API :", err);
      } finally {
        setLoadingEvolution(false);
      }
    };

    fetchEvolution();
  }, []);

  // -----------------------------------
  //  ETATS D’ERREUR / CHARGEMENT
  // -----------------------------------
  if (loadingDashboard) return <div>Chargement des données...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!dashboard) return <div>Aucune donnée disponible</div>;

  const { stats = {} } = dashboard;

  return (
    <Container fluid className="px-4 py-4">

      {/* ---------------- HEADER ---------------- */}
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
              <Dropdown.Toggle variant="light" size="sm">
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

      {/* ---------------- CARDS ---------------- */}
      <Row className="mb-4 g-4">

        <Col xl={3} lg={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h6 className="text-muted mb-2">Classes Actives</h6>
              <h3>{stats.totalClasses ?? 0}</h3>
              <div className="bg-primary bg-opacity-10 p-3 rounded float-end">
                <JournalBookmark size={24} className="text-primary" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h6 className="text-muted mb-2">Élèves Inscrits</h6>
              <h3>{stats.totalEleves ?? 0}</h3>
              <div className="bg-success bg-opacity-10 p-3 rounded float-end">
                <PeopleFill size={24} className="text-success" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h6 className="text-muted mb-2">Évaluations</h6>
              <h3>{stats.totalCodeClasses ?? 0}</h3>
              <div className="bg-warning bg-opacity-10 p-3 rounded float-end">
                <ClipboardData size={24} className="text-warning" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h6 className="text-muted mb-2">Total Utilisateurs</h6>
              <h3>{stats.totalUsers ?? 0}</h3>
              <div className="bg-info bg-opacity-10 p-3 rounded float-end">
                <GraphUp size={24} className="text-info" />
              </div>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      {/* ---------------- GRAPH ---------------- */}
      <Card className="shadow-sm border-0 chart-card">
        <Card.Header className="bg-white border-0">
          <h5 className="mb-0 fw-bold">Évolution des Utilisateurs</h5>
        </Card.Header>

        <Card.Body style={{ height: "360px" }}>
          {loadingEvolution ? (
            <p>Chargement...</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userEvolutionData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />

                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d6efd" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#0d6efd" stopOpacity={0.1} />
                  </linearGradient>
                </defs>

                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#0d6efd"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  fill="url(#colorUsers)"
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card.Body>
      </Card>

    </Container>
  );
};

export default AdminDashboard;
