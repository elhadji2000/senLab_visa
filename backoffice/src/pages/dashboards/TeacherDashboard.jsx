import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Table,
  Badge,
  ButtonGroup,
  Button,
  Dropdown,
} from "react-bootstrap";
import {
  PeopleFill,
  JournalBookmark,
  ClipboardData,
  Key,
  CalendarEvent,
  GraphUp,
  GearFill,
  BellFill,
  PersonCircle,
  CheckCircleFill,
  XCircleFill,
  ClockFill,
} from "react-bootstrap-icons";
import { fetchDashboard } from "../../api/student.api";
import { fetchDashboardResultats } from "../../api/student.api";

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dashboard, setDashboard] = useState(null);
  const [dashboardResultats, setDashboardResultats] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetchDashboard(); // 🔹 ton endpoint /dashboard
        const res2 = await fetchDashboardResultats();
        setDashboard(res.data ?? res);
        setDashboardResultats(res2.data ?? res);
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

  // Fallback si pas de données
  if (!dashboard) {
    return <div>Aucune donnée disponible</div>;
  }

  // Données extraites de l'API
  // eslint-disable-next-line no-unused-vars
  const { stats = {}, classes = [], eleves = [] } = dashboard;
  // Données extraites de l'API
  const { tauxReussite, evaluations = [] } = dashboardResultats;

  // On limite les récentes évaluations à 5 max
  const recentEvaluations = evaluations.slice(0, 5);

  return (
    <Container fluid className="px-4 py-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <h1 className="h2">Tableau de Bord Pédagogique</h1>
          <p className="mb-0 text-muted">
            Bienvenue, Professeur. Voici votre activité récente.
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
      <Row className="mb-4 g-2">
        <Col xl={2} lg={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Classes Actives</h6>
                  <h3 className="mb-0">
                    <p>{stats?.totalClasses ?? 0}</p>
                  </h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <JournalBookmark size={24} className="text-primary" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={2} lg={6}>
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
        <Col xl={2} lg={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Simulations</h6>
                  <h3 className="mb-0">{stats?.totalSimulation ?? 0}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <ClipboardData size={24} className="text-warning" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={2} lg={6}>
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

        <Col xl={2} lg={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Taux de Réussite</h6>
                  <h3 className="mb-0">
                    {tauxReussite ? `${tauxReussite}%` : "N/A"}
                  </h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <GraphUp size={24} className="text-info" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={2} lg={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Quizzes Disponibles</h6>
                  <h3 className="mb-0">{stats?.totalQuizzes ?? 0}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <ClipboardData size={24} className="text-success" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Vos Classes */}
      <Row className="g-4">
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Vos Classes</h5>
            </Card.Header>
            <Card.Body>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Nom de la Classe</th>
                    <th>Élèves</th>
                    <th>Progression</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes
                    .slice()
                    .reverse()
                    .map((cls) => {
                      const elevesCount = stats.elevesParClasse?.[cls._id] || 0;
                      const progress = Math.min(
                        Math.round((elevesCount / 30) * 100),
                        100
                      );

                      return (
                        <tr key={cls._id}>
                          <td>{cls.nom_classe}</td>
                          <td>{elevesCount}</td>
                          <td>
                            <ProgressBar
                              now={progress}
                              label={`${progress}%`}
                              variant={
                                progress > 80
                                  ? "success"
                                  : progress > 50
                                  ? "warning"
                                  : "danger"
                              }
                            />
                          </td>
                          <td>
                            <Button variant="outline-primary" size="sm">
                              Détails
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Évaluations récentes (statique pour le moment) */}
        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Évaluations Récentes</h5>
            </Card.Header>
            <Card.Body>
              {recentEvaluations.length > 0 ? (
                recentEvaluations.map((quiz) => (
                  <div key={quiz.id} className="mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between">
                      <h6 className="mb-1">{quiz.title}</h6>
                      <small className="text-muted">
                        {quiz.class || "Non attribuée"}
                      </small>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Soumissions: {quiz.submissions}</span>
                      <Badge
                        bg={
                          quiz.average > 75
                            ? "success"
                            : quiz.average > 50
                            ? "warning"
                            : "danger"
                        }
                      >
                        Moyenne: {quiz.average}%
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">Aucune évaluation disponible</p>
              )}
              <Button variant="outline-primary" size="sm" className="w-100">
                Voir toutes les évaluations
              </Button>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Accès Rapide</h5>
            </Card.Header>
            <Card.Body>
              <ButtonGroup vertical className="w-100">
                <Button variant="outline-primary" className="text-start mb-2">
                  <Key className="me-2" />
                  Générer un code d'accès
                </Button>
                <Button variant="outline-primary" className="text-start mb-2">
                  <JournalBookmark className="me-2" />
                  Créer une nouvelle classe
                </Button>
                <Button variant="outline-primary" className="text-start mb-2">
                  <ClipboardData className="me-2" />
                  Nouvelle évaluation
                </Button>
                <Button variant="outline-primary" className="text-start">
                  <PeopleFill className="me-2" />
                  Gérer les élèves
                </Button>
              </ButtonGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherDashboard;
