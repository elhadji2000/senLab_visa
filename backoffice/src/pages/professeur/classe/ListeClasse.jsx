import React, { useState, useEffect } from 'react';
import {
    Container, Table, Spinner, Alert, Button,
    Card, Row, Col, Badge, Modal, Form,
    InputGroup, Pagination
} from 'react-bootstrap';
import {
    EyeFill, PencilFill, TrashFill, PlusCircleFill,
    Search, CalendarFill, BookFill, PersonFill, InfoCircleFill
} from 'react-bootstrap-icons';
import { fetchClasses, createClass, deleteClass } from '../../../api/classes';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const ListeClasse = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [eleveCounts, setEleveCounts] = useState({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const classesPerPage = 8;
    const [formData, setFormData] = useState({
        nom_classe: '',
        niveau: '',
        annee_scolaire: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        description: ''
    });

    // Charger les classes
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const response = await fetchClasses();
                setClasses(response.data);
                await loadEleveCounts();
            } catch (err) {
                setError("Erreur lors du chargement des classes");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Charger le nombre d'élèves par classe
    const loadEleveCounts = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/eleves/count-by-classe', {
                headers: { Authorization: `${token}` }
            });
            setEleveCounts(response.data.counts || {});
        } catch (err) {
            console.error("Erreur lors du chargement des nombres d'élèves");
        }
    };

    // Gestion de la création de classe
    const handleCreateClass = async () => {
        try {
            const response = await createClass(formData);

            // Recharge les classes à partir du serveur
            const refreshed = await fetchClasses();
            setClasses(refreshed.data);

            // Reset modal
            setShowCreateModal(false);
            setFormData({
                nom_classe: '',
                niveau: '',
                annee_scolaire: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
                description: ''
            });
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la création de la classe");
        }
    };


    // Gestion de la suppression
    const handleDelete = async () => {
        try {
            await deleteClass(selectedClass._id);
            setClasses(classes.filter(c => c._id !== selectedClass._id));
            setShowDeleteModal(false);
        } catch (err) {
            setError("Erreur lors de la suppression de la classe");
        }
    };

    // Filtrage et pagination
    const filteredClasses = classes.filter(classe =>
        (classe?.nom_classe?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false) ||
        (classe?.niveau?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false)
    );


    const indexOfLastClass = currentPage * classesPerPage;
    const indexOfFirstClass = indexOfLastClass - classesPerPage;
    const currentClasses = filteredClasses.slice(indexOfFirstClass, indexOfLastClass);
    const totalPages = Math.ceil(filteredClasses.length / classesPerPage);

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
                                Gestion des classes
                            </h4>
                        </Col>
                        <Col md={6} className="d-flex justify-content-end">
                            <Button
                                variant="primary"
                                onClick={() => setShowCreateModal(true)}
                                className="d-flex align-items-center"
                            >
                                <PlusCircleFill className="me-2" />
                                Ajouter une classe
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
                                    placeholder="Rechercher une classe..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={6} className="d-flex align-items-center justify-content-end">
                            <Badge bg="light" text="dark" className="border me-2">
                                <InfoCircleFill className="me-1 text-info" />
                                {filteredClasses.length} classes trouvées
                            </Badge>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

            <Card className="shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: '30%' }}>
                                        <BookFill className="me-2" />
                                        Nom de la classe
                                    </th>
                                    <th>Niveau</th>
                                    <th>
                                        <PersonFill className="me-2" />
                                        Élèves
                                    </th>
                                    <th>
                                        <CalendarFill className="me-2" />
                                        Année scolaire
                                    </th>
                                    <th>Créé le</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentClasses.length > 0 ? (
                                    currentClasses.map((classe) => (
                                        <tr key={classe._id}>
                                            <td>
                                                <div className="fw-semibold">{classe.nom_classe}</div>
                                                {classe.description && (
                                                    <small className="text-muted">{classe.description}</small>
                                                )}
                                            </td>
                                            <td>
                                                <Badge bg="info" className="text-capitalize">
                                                    {classe.niveau}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg="light" text="dark" className="border">
                                                    {eleveCounts[classe._id] || 0} élèves
                                                </Badge>
                                            </td>
                                            <td>{classe.annee_scolaire}</td>
                                            <td>{moment(classe.createdAt).format('LL')}</td>
                                            <td className="text-end">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="me-2"
                                                    title="Voir détails"
                                                >
                                                    <EyeFill />
                                                </Button>
                                                <Button
                                                    variant="outline-warning"
                                                    size="sm"
                                                    className="me-2"
                                                    title="Modifier"
                                                >
                                                    <PencilFill />
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    title="Supprimer"
                                                    onClick={() => {
                                                        setSelectedClass(classe);
                                                        setShowDeleteModal(true);
                                                    }}
                                                >
                                                    <TrashFill />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            <div className="text-muted">Aucune classe trouvée</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between align-items-center">
                    <div className="text-muted">
                        Affichage de {indexOfFirstClass + 1} à {Math.min(indexOfLastClass, filteredClasses.length)} sur {filteredClasses.length} classes
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

            {/* Modal de création */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <PlusCircleFill className="me-2 text-primary" />
                        Créer une nouvelle classe
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group controlId="nomClasse">
                                    <Form.Label>Nom de la classe</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex: Terminale S"
                                        value={formData.nom_classe}
                                        onChange={(e) => setFormData({ ...formData, nom_classe: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="niveauClasse">
                                    <Form.Label>Niveau</Form.Label>
                                    <Form.Select
                                        value={formData.niveau}
                                        onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                                        required
                                    >
                                        <option value="">Sélectionnez un niveau</option>
                                        <option value="6ème">6ème</option>
                                        <option value="5ème">5ème</option>
                                        <option value="4ème">4ème</option>
                                        <option value="3ème">3ème</option>
                                        <option value="2nde">2nde</option>
                                        <option value="1ère">1ère</option>
                                        <option value="Terminale">Terminale</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="anneeScolaire">
                                    <Form.Label>Année scolaire</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex: 2023-2024"
                                        value={formData.annee_scolaire}
                                        onChange={(e) => setFormData({ ...formData, annee_scolaire: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group controlId="descriptionClasse">
                                    <Form.Label>Description (optionnelle)</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Description de la classe..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleCreateClass}>
                        Créer la classe
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de suppression */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>Confirmer la suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Êtes-vous sûr de vouloir supprimer la classe <strong>"{selectedClass?.nom_classe}"</strong> ?
                    Cette action est irréversible et supprimera également tous les élèves associés.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Confirmer la suppression
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ListeClasse;