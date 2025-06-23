import React, { useEffect, useState } from 'react';
import {
  Container, Table, Button, Modal, Form, Spinner, Alert,
  Row, Col, Badge, Card, InputGroup, Pagination
} from 'react-bootstrap';
import {
  EyeFill, PencilFill, TrashFill, PlusCircleFill, Search,
  CalendarFill, BookFill, InfoCircleFill
} from 'react-bootstrap-icons';
import {
  fetchCodeClasses,
  addCodeClasse,
  deleteCodeClasse,
  getCodeClasseById,
  updateCodeClasse
} from '../../../api/codeClasseAPI';
import { fetchClasses } from '../../../api/classes';
import { fetchQuizzes } from '../../../api/quizAPI';
import { fetchSimulations } from '../../../api/simulationAPI';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const Code = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    code: '',
    classe: '',
    quiz: '',
    simulation: '',
    description: '',
    date_debut: '',
    expiration: ''
  });
  const [classes, setClasses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [simulations, setSimulations] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const codesPerPage = 8;

  // Fonction pour déterminer le statut
  const getStatus = (code) => {
    const now = moment();
    const startDate = moment(code.date_debut);
    const endDate = moment(code.expiration);

    if (!startDate.isValid() || !endDate.isValid()) return 'inconnu';

    if (now.isBefore(startDate)) {
      return 'non démarré';
    } else if (now.isBetween(startDate, endDate)) {
      return 'en cours';
    } else {
      return 'expiré';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [codeRes, classRes, quizRes, simRes] = await Promise.all([
        fetchCodeClasses(),
        fetchClasses(),
        fetchQuizzes(),
        fetchSimulations(),
      ]);

      // Ajouter le statut à chaque code
      const codesWithStatus = codeRes.data.map(code => ({
        ...code,
        status: getStatus(code)
      }));

      setCodes(codesWithStatus);
      setClasses(classRes.data);
      setQuizzes(quizRes.data.quizzes || quizRes.data);
      setSimulations(simRes.data);
      setError('');
    } catch (err) {
      setError("Erreur de chargement des données");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateCodeClasse(formData._id, formData);
      } else {
        await addCodeClasse(formData);
      }
      setShowModal(false);
      setFormData({
        nom: '',
        code: '',
        classe: '',
        quiz: '',
        simulation: '',
        description: '',
        date_debut: '',
        expiration: ''
      });
      setEditMode(false);
      loadData();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'opération");
    }
  };

  const handleEdit = async (id) => {
    try {
      const { data } = await getCodeClasseById(id);
      setFormData({
        ...data,
        date_debut: data.date_debut ? data.date_debut.substring(0, 10) : '',
        expiration: data.expiration ? data.expiration.substring(0, 10) : ''
      });
      setEditMode(true);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des données");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      try {
        await deleteCodeClasse(id);
        loadData();
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la suppression");
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'en cours':
        return <Badge bg="success">{status}</Badge>;
      case 'non démarré':
        return <Badge bg="warning" text="dark">{status}</Badge>;
      case 'expiré':
        return <Badge bg="danger">{status}</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Filtrage et pagination
  const filteredCodes = codes.filter(code =>
    code.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (code.classe?.nom && code.classe.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (code.quiz?.titre && code.quiz.titre.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (code.simulation?.titre && code.simulation.titre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastCode = currentPage * codesPerPage;
  const indexOfFirstCode = indexOfLastCode - codesPerPage;
  const currentCodes = filteredCodes.slice(indexOfFirstCode, indexOfLastCode);
  const totalPages = Math.ceil(filteredCodes.length / codesPerPage);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={6}>
              <h4 className="mb-0">
                <BookFill className="me-2 text-primary" />
                Gestion des Codes d'Accès
              </h4>
            </Col>
            <Col md={6} className="d-flex justify-content-end">
              <Button
                variant="primary"
                onClick={() => {
                  setShowModal(true);
                  setFormData({
                    nom: '',
                    code: '',
                    classe: '',
                    quiz: '',
                    simulation: '',
                    description: '',
                    date_debut: '',
                    expiration: ''
                  });
                  setEditMode(false);
                }}
                className="d-flex align-items-center"
              >
                <PlusCircleFill className="me-2" />
                Ajouter un code
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Rechercher un code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6} className="d-flex align-items-center justify-content-end">
              <Badge bg="light" text="dark" className="border me-2">
                <InfoCircleFill className="me-1 text-info" />
                {filteredCodes.length} codes trouvés
              </Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger" className="mb-4" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Nom</th>
                  <th>Code</th>
                  <th>Classe</th>
                  <th>Quiz</th>
                  <th>Simulation</th>
                  <th>
                    <CalendarFill className="me-2" />
                    Date début
                  </th>
                  <th>Expiration</th>
                  <th>Statut</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCodes.length > 0 ? (
                  currentCodes.map((code, idx) => (
                    <tr key={code._id}>
                      <td>{indexOfFirstCode + idx + 1}</td>
                      <td className="fw-semibold">{code.nom}</td>
                      <td>
                        <Badge bg="info" text="dark" className="font-monospace">
                          {code.code}
                        </Badge>
                      </td>
                      <td>{code.classe?.nom_classe || '-'}</td>
                      <td>{code.quiz?.titre || '-'}</td>
                      <td>{code.simulation?.titre || '-'}</td>
                      <td>{code.date_debut ? moment(code.date_debut).format('DD/MM/YYYY') : '-'}</td>
                      <td>{code.expiration ? moment(code.expiration).format('DD/MM/YYYY') : '-'}</td>
                      <td>{getStatusBadge(code.status)}</td>
                      <td className="text-end">
                        <div className="d-flex gap-2 justify-content-end">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(code._id)}
                            title="Détails"
                          >
                            <EyeFill />
                          </Button>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(code._id)}
                            title="Modifier"
                          >
                            <PencilFill />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(code._id)}
                            title="Supprimer"
                          >
                            <TrashFill />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      <div className="text-muted">Aucun code trouvé</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center">
          <div className="text-muted">
            Affichage de {indexOfFirstCode + 1} à {Math.min(indexOfLastCode, filteredCodes.length)} sur {filteredCodes.length} codes
          </div>
          <Pagination className="mb-0">
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
        </Card.Footer>
      </Card>

      {/* Modal pour ajout/modification */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? (
              <>
                <PencilFill className="me-2 text-warning" />
                Modifier le code
              </>
            ) : (
              <>
                <PlusCircleFill className="me-2 text-primary" />
                Créer un nouveau code
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Code promo 2023"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Code <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    placeholder="Ex: PROMO2023"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Classe <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="classe"
                    value={formData.classe}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner une classe</option>
                    {Array.isArray(classes) &&
                    classes.map((c) => (
                      <option key={c._id} value={c._id}>{c.nom_classe}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quiz</Form.Label>
                  <Form.Select
                    name="quiz"
                    value={formData.quiz}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionner un quiz (optionnel)</option>
                    {Array.isArray(quizzes) &&
                      quizzes.map((quiz) => (
                        <option key={quiz._id} value={quiz._id}>{quiz.titre}</option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Simulation</Form.Label>
                  <Form.Select
                    name="simulation"
                    value={formData.simulation}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionner une simulation (optionnel)</option>
                    {simulations.map((s) => (
                      <option key={s._id} value={s._id}>{s.titre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Description optionnelle"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date de début <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="date"
                    name="date_debut"
                    value={formData.date_debut}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date d'expiration <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="date"
                    name="expiration"
                    value={formData.expiration}
                    onChange={handleChange}
                    required
                    min={formData.date_debut}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                {editMode ? 'Mettre à jour' : 'Enregistrer'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Code;