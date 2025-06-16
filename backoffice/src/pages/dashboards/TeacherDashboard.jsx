import React from 'react';
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
  Tab,
  Tabs
} from 'react-bootstrap';
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
  ClockFill
} from 'react-bootstrap-icons';

const TeacherDashboard = () => {
  // Données de démonstration
  const classes = [
    { id: 1, name: "Physique 101", students: 32, progress: 75 },
    { id: 2, name: "Chimie Avancée", students: 24, progress: 60 },
    { id: 3, name: "Mathématiques TS", students: 28, progress: 90 }
  ];

  const recentQuizzes = [
    { id: 1, title: "Test Thermodynamique", class: "Physique 101", date: "15/06/2023", submissions: 24, average: 72 },
    { id: 2, title: "Examen Chimie Organique", class: "Chimie Avancée", date: "10/06/2023", submissions: 18, average: 65 },
    { id: 3, title: "Géométrie Algébrique", class: "Mathématiques TS", date: "05/06/2023", submissions: 26, average: 84 }
  ];

  const upcomingTasks = [
    { id: 1, task: "Corriger copies Physique", due: "Demain", priority: "high" },
    { id: 2, task: "Préparer TP Chimie", due: "18/06/2023", priority: "medium" },
    { id: 3, task: "Envoyer ressources Maths", due: "20/06/2023", priority: "low" }
  ];

  const studentPerformance = [
    { id: 1, name: "Jean Dupont", lastQuiz: 85, overall: 78, trend: "up" },
    { id: 2, name: "Marie Lambert", lastQuiz: 72, overall: 75, trend: "stable" },
    { id: 3, name: "Pierre Garnier", lastQuiz: 68, overall: 72, trend: "down" }
  ];

  return (
    <Container fluid className="px-4 py-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <h1 className="h2">Tableau de Bord Pédagogique</h1>
          <p className="mb-0 text-muted">Bienvenue, Professeur. Voici votre activité récente.</p>
        </Col>
        <Col md={6} className="d-flex justify-content-end">
          <ButtonGroup>
            <Button variant="outline-secondary" size="sm">
              <BellFill className="me-2" />
              Notifications
            </Button>
            <Button variant="outline-secondary" size="sm">
              <GearFill className="me-2" />
              Paramètres
            </Button>
            <Dropdown>
              <Dropdown.Toggle variant="light" size="sm" id="profile-dropdown">
                <PersonCircle className="me-2" />
                Mon compte
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
                  <h3 className="mb-0">3</h3>
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
                  <h3 className="mb-0">84</h3>
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
                  <h3 className="mb-0">12</h3>
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
                  <h6 className="text-muted mb-2">Taux de Réussite</h6>
                  <h3 className="mb-0">78%</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <GraphUp size={24} className="text-info" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row className="g-4">
        {/* Left Column */}
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
                  {classes.map(cls => (
                    <tr key={cls.id}>
                      <td>{cls.name}</td>
                      <td>{cls.students}</td>
                      <td>
                        <ProgressBar now={cls.progress} label={`${cls.progress}%`} variant={cls.progress > 80 ? "success" : cls.progress > 50 ? "warning" : "danger"} />
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm">Détails</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Performances des Élèves</h5>
            </Card.Header>
            <Card.Body>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Élève</th>
                    <th>Dernier Quiz</th>
                    <th>Moyenne</th>
                    <th>Tendance</th>
                  </tr>
                </thead>
                <tbody>
                  {studentPerformance.map(student => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.lastQuiz}/100</td>
                      <td>{student.overall}/100</td>
                      <td>
                        {student.trend === "up" ? (
                          <Badge bg="success" className="d-flex align-items-center">
                            <GraphUp size={12} className="me-1" /> Amélioration
                          </Badge>
                        ) : student.trend === "down" ? (
                          <Badge bg="danger" className="d-flex align-items-center">
                            <GraphUp size={12} className="me-1 rotate-180" /> Baisse
                          </Badge>
                        ) : (
                          <Badge bg="secondary" className="d-flex align-items-center">
                            <GraphUp size={12} className="me-1" /> Stable
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column */}
        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Évaluations Récentes</h5>
            </Card.Header>
            <Card.Body>
              {recentQuizzes.map(quiz => (
                <div key={quiz.id} className="mb-3 pb-3 border-bottom">
                  <div className="d-flex justify-content-between">
                    <h6 className="mb-1">{quiz.title}</h6>
                    <small className="text-muted">{quiz.date}</small>
                  </div>
                  <small className="text-muted d-block mb-2">{quiz.class}</small>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Soumissions: {quiz.submissions}/{quiz.class === "Physique 101" ? 32 : quiz.class === "Chimie Avancée" ? 24 : 28}</span>
                    <Badge bg={quiz.average > 75 ? "success" : quiz.average > 50 ? "warning" : "danger"}>
                      Moyenne: {quiz.average}%
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline-primary" size="sm" className="w-100">
                Voir toutes les évaluations
              </Button>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Tâches à Venir</h5>
            </Card.Header>
            <Card.Body>
              {upcomingTasks.map(task => (
                <div key={task.id} className="mb-3 d-flex align-items-start">
                  <div className="me-3 pt-1">
                    {task.priority === "high" ? (
                      <XCircleFill size={16} className="text-danger" />
                    ) : task.priority === "medium" ? (
                      <ClockFill size={16} className="text-warning" />
                    ) : (
                      <CheckCircleFill size={16} className="text-success" />
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <h6 className="mb-1">{task.task}</h6>
                      <small className="text-muted">{task.due}</small>
                    </div>
                    <small className="text-muted">Priorité: {task.priority === "high" ? "Haute" : task.priority === "medium" ? "Moyenne" : "Basse"}</small>
                  </div>
                </div>
              ))}
              <Button variant="outline-secondary" size="sm" className="w-100 mt-2">
                <CalendarEvent className="me-2" />
                Voir le calendrier
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