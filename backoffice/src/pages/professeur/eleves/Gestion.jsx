import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Form,
  InputGroup,
  Dropdown,
  Modal,
  ProgressBar,
  Spinner,
  Alert,
  Pagination,
  Tab,
  Tabs,
  Nav,
  ListGroup
} from 'react-bootstrap';
import {
  PeopleFill,
  BookFill,
  ClipboardCheckFill,
  PlusCircleFill,
  Download,
  Upload,
  FileExcel,
  GraphUp,
  Filter,
  Search,
  EyeFill,
  PencilFill,
  TrashFill,
  CheckCircleFill,
  XCircleFill,
  CalendarEvent,
  PersonPlusFill,
  EnvelopeFill,
  PersonLinesFill,
  GearFill,
  ThreeDotsVertical
} from 'react-bootstrap-icons';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const StudentManagement = () => {
  // Sample data
  const [classes, setClasses] = useState([
    { id: 1, name: 'Terminale S', level: 'Terminale', year: '2024-2025' },
    { id: 2, name: '1ère D', level: '1ère', year: '2024-2025' },
    { id: 3, name: '4ème B', level: '4ème', year: '2024-2025' }
  ]);

  const [quizzes, setQuizzes] = useState([
    { id: 1, title: 'Examen de Physique', classId: 1, date: '2025-06-15', average: 14.5 },
    { id: 2, title: 'Test de Chimie', classId: 1, date: '2025-05-20', average: 12.3 },
    { id: 3, title: 'Interro Math', classId: 2, date: '2025-06-10', average: 16.2 }
  ]);

  const [students, setStudents] = useState([
    { 
      id: 1, 
      firstName: 'Aminata', 
      lastName: 'Diop', 
      birthDate: '2007-03-15', 
      email: 'aminata.diop@example.com',
      classId: 1,
      registrationNumber: 'MAT2025001'
    },
    { 
      id: 2, 
      firstName: 'Moussa', 
      lastName: 'Ndiaye', 
      birthDate: '2006-11-22', 
      email: 'moussa.ndiaye@example.com',
      classId: 1,
      registrationNumber: 'MAT2025002'
    },
    { 
      id: 3, 
      firstName: 'Rokhaya', 
      lastName: 'Fall', 
      birthDate: '2008-01-05', 
      email: 'rokhaya.fall@example.com',
      classId: 2,
      registrationNumber: 'MAT2025003'
    }
  ]);

  const [results, setResults] = useState([
    { 
      id: 1, 
      studentId: 1, 
      quizId: 1, 
      score: 18, 
      submissionDate: '2025-06-15T14:30:00',
      status: 'completed'
    },
    { 
      id: 2, 
      studentId: 1, 
      quizId: 2, 
      score: 15, 
      submissionDate: '2025-05-20T10:15:00',
      status: 'completed'
    },
    { 
      id: 3, 
      studentId: 2, 
      quizId: 1, 
      score: 12, 
      submissionDate: '2025-06-15T14:45:00',
      status: 'completed'
    }
  ]);

  // UI state
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showStudentDetail, setShowStudentDetail] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('students');
  const itemsPerPage = 5;

  // Form data
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    classId: '',
    registrationNumber: ''
  });

  const [importFile, setImportFile] = useState(null);

  // Filter results
  const filteredResults = results.filter(r => 
    (!selectedQuiz || r.quizId === selectedQuiz) && 
    (!selectedClass || students.find(s => s.id === r.studentId)?.classId === selectedClass)
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  // Handlers
  const handleAddStudent = () => {
    const newId = Math.max(...students.map(s => s.id)) + 1;
    setStudents([...students, { ...newStudent, id: newId }]);
    setShowAddModal(false);
    setNewStudent({
      firstName: '',
      lastName: '',
      birthDate: '',
      email: '',
      classId: '',
      registrationNumber: ''
    });
  };

  const handleImport = () => {
    // Implement actual Excel import logic here
    alert(`Fichier ${importFile?.name} prêt pour import!`);
    setShowImportModal(false);
    setImportFile(null);
  };

  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
    setShowStudentDetail(true);
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h2 mb-2">Gestion des Élèves et Résultats</h1>
          <p className="text-muted mb-0">
            Suivi complet des élèves, classes et résultats d'évaluations
          </p>
        </Col>
      </Row>

      <Row>
        {/* Left sidebar - Classes and Quizzes */}
        <Col md={3}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <BookFill className="me-2" />
                Classes
              </h5>
              <Dropdown>
                <Dropdown.Toggle variant="light" size="sm" id="class-filter">
                  <Filter size={14} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSelectedClass(null)}>Toutes les classes</Dropdown.Item>
                  {classes.map(cls => (
                    <Dropdown.Item 
                      key={cls.id} 
                      onClick={() => setSelectedClass(cls.id)}
                      active={selectedClass === cls.id}
                    >
                      {cls.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                {classes.map(cls => (
                  <ListGroup.Item 
                    key={cls.id}
                    action
                    active={selectedClass === cls.id}
                    onClick={() => setSelectedClass(cls.id)}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{cls.name}</strong>
                      <div className="text-muted small">{cls.level} - {cls.year}</div>
                    </div>
                    <Badge bg="primary">
                      {students.filter(s => s.classId === cls.id).length}
                    </Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <ClipboardCheckFill className="me-2" />
                Évaluations
              </h5>
              <Dropdown>
                <Dropdown.Toggle variant="light" size="sm" id="quiz-filter">
                  <Filter size={14} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSelectedQuiz(null)}>Toutes les évaluations</Dropdown.Item>
                  {quizzes
                    .filter(q => !selectedClass || q.classId === selectedClass)
                    .map(q => (
                      <Dropdown.Item 
                        key={q.id} 
                        onClick={() => setSelectedQuiz(q.id)}
                        active={selectedQuiz === q.id}
                      >
                        {q.title}
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                {quizzes
                  .filter(q => !selectedClass || q.classId === selectedClass)
                  .map(q => (
                    <ListGroup.Item 
                      key={q.id}
                      action
                      active={selectedQuiz === q.id}
                      onClick={() => setSelectedQuiz(q.id)}
                    >
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>{q.title}</strong>
                          <div className="text-muted small">
                            {format(parseISO(q.date), 'dd MMM yyyy', { locale: fr })}
                          </div>
                        </div>
                        <Badge bg="info">
                          {q.average}/20
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Main content */}
        <Col md={9}>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="students" title={
              <>
                <PeopleFill className="me-1" />
                Élèves
              </>
            }>
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    Liste des Élèves
                    {selectedClass && (
                      <span className="text-muted ms-2">
                        - {classes.find(c => c.id === selectedClass)?.name}
                      </span>
                    )}
                  </h5>
                  <div>
                    <Button
                      variant="primary"
                      className="me-2"
                      onClick={() => setShowAddModal(true)}
                    >
                      <PersonPlusFill className="me-2" />
                      Ajouter
                    </Button>
                    <Button
                      variant="outline-primary"
                      onClick={() => setShowImportModal(true)}
                    >
                      <Upload className="me-2" />
                      Importer
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <InputGroup>
                      <InputGroup.Text>
                        <Search />
                      </InputGroup.Text>
                      <Form.Control placeholder="Rechercher un élève..." />
                    </InputGroup>
                  </div>
                  
                  <Table hover responsive>
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Classe</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students
                        .filter(s => !selectedClass || s.classId === selectedClass)
                        .map(student => (
                          <tr key={student.id}>
                            <td>{student.lastName}</td>
                            <td>{student.firstName}</td>
                            <td>
                              <a href={`mailto:${student.email}`}>
                                <EnvelopeFill className="me-1" />
                                {student.email}
                              </a>
                            </td>
                            <td>
                              <Badge bg="secondary">
                                {classes.find(c => c.id === student.classId)?.name}
                              </Badge>
                            </td>
                            <td className="text-end">
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-2"
                                onClick={() => viewStudentDetails(student)}
                              >
                                <EyeFill />
                              </Button>
                              <Button variant="outline-warning" size="sm" className="me-2">
                                <PencilFill />
                              </Button>
                              <Button variant="outline-danger" size="sm">
                                <TrashFill />
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="results" title={
              <>
                <GraphUp className="me-1" />
                Résultats
              </>
            }>
              <Card className="shadow-sm">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    Résultats des Évaluations
                    {selectedQuiz && (
                      <span className="text-muted ms-2">
                        - {quizzes.find(q => q.id === selectedQuiz)?.title}
                      </span>
                    )}
                  </h5>
                  <div>
                    <Button variant="outline-primary" className="me-2">
                      <Download className="me-2" />
                      Exporter
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  {filteredResults.length === 0 ? (
                    <Alert variant="info">
                      Aucun résultat à afficher. Veuillez sélectionner une classe et/ou une évaluation.
                    </Alert>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <Table hover>
                          <thead>
                            <tr>
                              <th>Élève</th>
                              <th>Évaluation</th>
                              <th>Note</th>
                              <th>Date Soumission</th>
                              <th>Statut</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentItems.map(result => {
                              const student = students.find(s => s.id === result.studentId);
                              const quiz = quizzes.find(q => q.id === result.quizId);
                              return (
                                <tr key={result.id}>
                                  <td>
                                    {student?.lastName} {student?.firstName}
                                    <div className="text-muted small">
                                      {classes.find(c => c.id === student?.classId)?.name}
                                    </div>
                                  </td>
                                  <td>{quiz?.title}</td>
                                  <td className="fw-bold" style={{
                                    color: result.score >= 10 ? '#28a745' : '#dc3545'
                                  }}>
                                    {result.score}/20
                                  </td>
                                  <td>
                                    {format(parseISO(result.submissionDate), 'dd MMM yyyy HH:mm', { locale: fr })}
                                  </td>
                                  <td>
                                    <Badge bg={result.score >= 10 ? 'success' : 'danger'}>
                                      {result.score >= 10 ? 'Réussi' : 'Échoué'}
                                    </Badge>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                      <div className="d-flex justify-content-between mt-3">
                        <div>
                          <Pagination>
                            <Pagination.Prev 
                              disabled={currentPage === 1} 
                              onClick={() => setCurrentPage(currentPage - 1)}
                            />
                            {[...Array(totalPages)].map((_, i) => (
                              <Pagination.Item
                                key={i + 1}
                                active={i + 1 === currentPage}
                                onClick={() => setCurrentPage(i + 1)}
                              >
                                {i + 1}
                              </Pagination.Item>
                            ))}
                            <Pagination.Next 
                              disabled={currentPage === totalPages} 
                              onClick={() => setCurrentPage(currentPage + 1)}
                            />
                          </Pagination>
                        </div>
                        <div className="text-muted">
                          Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredResults.length)} sur {filteredResults.length} résultats
                        </div>
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Add Student Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <PersonPlusFill className="me-2" />
            Ajouter un nouvel élève
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={newStudent.lastName}
                    onChange={(e) => setNewStudent({...newStudent, lastName: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prénom</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={newStudent.firstName}
                    onChange={(e) => setNewStudent({...newStudent, firstName: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date de naissance</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={newStudent.birthDate}
                    onChange={(e) => setNewStudent({...newStudent, birthDate: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Matricule</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={newStudent.registrationNumber}
                    onChange={(e) => setNewStudent({...newStudent, registrationNumber: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Classe</Form.Label>
                  <Form.Select
                    value={newStudent.classId}
                    onChange={(e) => setNewStudent({...newStudent, classId: e.target.value})}
                    required
                  >
                    <option value="">Sélectionnez une classe</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} - {cls.level}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddStudent}
            disabled={!newStudent.lastName || !newStudent.firstName || !newStudent.email || !newStudent.classId}
          >
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Import Students Modal */}
      <Modal show={showImportModal} onHide={() => setShowImportModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FileExcel className="me-2" />
            Importer une liste d'élèves
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info" className="mb-4">
            <strong>Format attendu :</strong> Fichier Excel (.xlsx) avec colonnes: Nom, Prénom, DateNaissance, Email, Matricule
          </Alert>
          
          <Form.Group className="mb-3">
            <Form.Label>Sélectionnez le fichier Excel</Form.Label>
            <Form.Control 
              type="file" 
              accept=".xlsx, .xls"
              onChange={(e) => setImportFile(e.target.files[0])}
            />
          </Form.Group>
          
          <Form.Group>
            <Form.Label>Classe de destination</Form.Label>
            <Form.Select
              value={selectedClass || ''}
              onChange={(e) => setSelectedClass(e.target.value ? parseInt(e.target.value) : null)}
              required
            >
              <option value="">Sélectionnez une classe</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} - {cls.level}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImportModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={handleImport}
            disabled={!importFile || !selectedClass}
          >
            <Upload className="me-2" />
            Importer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Student Detail Modal */}
      <Modal show={showStudentDetail} onHide={() => setShowStudentDetail(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <PersonLinesFill className="me-2" />
            Détails de l'élève
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <Row>
              <Col md={6}>
                <div className="mb-4">
                  <h5 className="mb-3">Informations personnelles</h5>
                  <div className="mb-2">
                    <strong>Nom complet:</strong> {selectedStudent.lastName} {selectedStudent.firstName}
                  </div>
                  <div className="mb-2">
                    <strong>Date de naissance:</strong> {format(parseISO(selectedStudent.birthDate), 'dd MMM yyyy', { locale: fr })}
                  </div>
                  <div className="mb-2">
                    <strong>Email:</strong> <a href={`mailto:${selectedStudent.email}`}>{selectedStudent.email}</a>
                  </div>
                  <div className="mb-2">
                    <strong>Matricule:</strong> {selectedStudent.registrationNumber}
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-4">
                  <h5 className="mb-3">Classe</h5>
                  <Badge bg="primary" className="fs-6">
                    {classes.find(c => c.id === selectedStudent.classId)?.name}
                  </Badge>
                </div>
                
                <div>
                  <h5 className="mb-3">Résultats récents</h5>
                  {results.filter(r => r.studentId === selectedStudent.id).length > 0 ? (
                    <ListGroup>
                      {results
                        .filter(r => r.studentId === selectedStudent.id)
                        .slice(0, 3)
                        .map(result => {
                          const quiz = quizzes.find(q => q.id === result.quizId);
                          return (
                            <ListGroup.Item key={result.id}>
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <strong>{quiz?.title}</strong>
                                  <div className="text-muted small">
                                    {format(parseISO(result.submissionDate), 'dd MMM yyyy', { locale: fr })}
                                  </div>
                                </div>
                                <Badge bg={result.score >= 10 ? 'success' : 'danger'}>
                                  {result.score}/20
                                </Badge>
                              </div>
                            </ListGroup.Item>
                          );
                        })}
                    </ListGroup>
                  ) : (
                    <Alert variant="info">
                      Aucun résultat disponible pour cet élève
                    </Alert>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStudentDetail(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StudentManagement;