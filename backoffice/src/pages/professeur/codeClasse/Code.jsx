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
  Spinner,
  Alert,
  Pagination,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';
import {
  PlusCircleFill,
  Copy,
  TrashFill,
  EyeFill,
  Search,
  Filter,
  Download,
  ClockFill,
  CalendarFill,
  BookFill,
  CheckCircleFill,
  XCircleFill,
  ArrowRepeat,
  InfoCircleFill
} from 'react-bootstrap-icons';
import { format, addDays, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';

const CodeAccessPage = () => {
  // Données des codes d'accès
  const [codes, setCodes] = useState([
    { 
      id: 1, 
      code: 'ABC123', 
      classe: 'Terminale S', 
      dateCreation: new Date('2025-06-01'), 
      dateDebut: new Date('2025-06-01'),
      dateExpiration: addDays(new Date('2025-06-01'), 30),
      nbUtilisations: 12,
      nbUtilisationsMax: 25,
      statut: 'actif'
    },
    { 
      id: 2, 
      code: 'XYZ789', 
      classe: '1ère D', 
      dateCreation: new Date('2025-05-25'),
      dateDebut: new Date('2025-05-25'),
      dateExpiration: addDays(new Date('2025-05-25'), 15),
      nbUtilisations: 5,
      nbUtilisationsMax: 20,
      statut: 'actif'
    },
    { 
      id: 3, 
      code: 'LMN456', 
      classe: '4ème B', 
      dateCreation: new Date('2025-05-20'),
      dateDebut: new Date('2025-05-20'),
      dateExpiration: addDays(new Date('2025-05-20'), 7),
      nbUtilisations: 9,
      nbUtilisationsMax: 15,
      statut: 'expiré'
    },
  ]);

  // États pour les modales et filtres
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const codesPerPage = 5;

  // Nouveau code form
  const [newCode, setNewCode] = useState({
    classe: '',
    dateDebut: format(new Date(), 'yyyy-MM-dd'),
    dateExpiration: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    utilisationsMax: 25,
    generateMethod: 'auto'
  });

  // Fonctions de gestion
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    // Vous pouvez utiliser un système de notification plus élégant ici
    alert(`Code "${code}" copié dans le presse-papier !`);
  };

  const handleDelete = (id) => {
    setCodes(codes.filter(code => code.id !== id));
    setShowDeleteModal(false);
  };

  const generateNewCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const newCodeObj = {
      id: codes.length + 1,
      code: result,
      classe: newCode.classe,
      dateCreation: new Date(),
      dateDebut: new Date(newCode.dateDebut),
      dateExpiration: new Date(newCode.dateExpiration),
      nbUtilisations: 0,
      nbUtilisationsMax: newCode.utilisationsMax,
      statut: 'actif'
    };
    
    setCodes([...codes, newCodeObj]);
    setShowGenerateModal(false);
    setNewCode({
      classe: '',
     dateDebut: new Date(),
  dateExpiration: addDays(new Date(), 1),
      utilisationsMax: 25,
      generateMethod: 'auto'
    });
  };

  const renewCode = (id) => {
    setCodes(codes.map(code => {
      if (code.id === id) {
        return {
          ...code,
          dateExpiration: addDays(new Date(), 7),
          statut: 'actif'
        };
      }
      return code;
    }));
  };

  // Filtrage et pagination
  const filteredCodes = codes.filter(code => {
    const matchesSearch = code.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         code.classe.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || code.statut === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastCode = currentPage * codesPerPage;
  const indexOfFirstCode = indexOfLastCode - codesPerPage;
  const currentCodes = filteredCodes.slice(indexOfFirstCode, indexOfLastCode);
  const totalPages = Math.ceil(filteredCodes.length / codesPerPage);

  // Fonction pour déterminer le statut
  const getCodeStatus = (code) => {
    if (code.statut === 'expiré') return 'expiré';
    if (isAfter(new Date(), code.dateExpiration)) return 'expiré';
    if (code.nbUtilisations >= code.nbUtilisationsMax) return 'limite atteinte';
    return 'actif';
  };

  return (
    <Container fluid className="py-4">
      {/* En-tête de page */}
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <h1 className="h2 mb-2">Gestion des Codes d'Accès</h1>
          <p className="text-muted mb-0">
            Créez et gérez les codes permettant aux élèves de rejoindre vos classes
          </p>
        </Col>
        <Col md={6} className="d-flex justify-content-end">
          <Button 
            variant="success" 
            onClick={() => setShowGenerateModal(true)}
            className="d-flex align-items-center"
          >
            <PlusCircleFill className="me-2" />
            Générer un code
          </Button>
        </Col>
      </Row>

      {/* Filtres et recherche */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Rechercher un code ou une classe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-between">
                  <Filter className="me-2" />
                  {activeFilter === 'all' ? 'Tous les statuts' : 
                   activeFilter === 'actif' ? 'Actifs' : 
                   activeFilter === 'expiré' ? 'Expirés' : 'Limite atteinte'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setActiveFilter('all')}>Tous les statuts</Dropdown.Item>
                  <Dropdown.Item onClick={() => setActiveFilter('actif')}>Actifs</Dropdown.Item>
                  <Dropdown.Item onClick={() => setActiveFilter('expiré')}>Expirés</Dropdown.Item>
                  <Dropdown.Item onClick={() => setActiveFilter('limite atteinte')}>Limite atteinte</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col md={3}>
              <Button variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-center">
                <Download className="me-2" />
                Exporter
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tableau des codes */}
      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Code</th>
                  <th>Classe associée</th>
                  <th>Date de création</th>
                  <th>Validité</th>
                  <th>Utilisations</th>
                  <th>Statut</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCodes.length > 0 ? (
                  currentCodes.map((code) => {
                    const status = getCodeStatus(code);
                    return (
                      <tr key={code.id}>
                        <td>
                          <div className="font-monospace fw-bold text-primary">{code.code}</div>
                        </td>
                        <td>{code.classe}</td>
                        <td>
                          <div>{format(code.dateCreation, 'dd MMM yyyy', { locale: fr })}</div>
                          <small className="text-muted">
                            {format(code.dateCreation, 'HH:mm', { locale: fr })}
                          </small>
                        </td>
                        <td>
                          <div>
                            <strong>Début:</strong> {format(code.dateDebut, "dd MMM yyyy HH:mm", { locale: fr })}
                          </div>
                          <div>
                            <strong>Fin:</strong> {format(code.dateExpiration, "dd MMM yyyy HH:mm", { locale: fr })}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress w-100" style={{ height: '8px' }}>
                              <div 
                                className="progress-bar bg-info" 
                                role="progressbar" 
                                style={{ 
                                  width: `${(code.nbUtilisations / code.nbUtilisationsMax) * 100}%` 
                                }} 
                              />
                            </div>
                            <small className="ms-2">
                              {code.nbUtilisations}/{code.nbUtilisationsMax}
                            </small>
                          </div>
                        </td>
                        <td>
                          <Badge 
                            bg={
                              status === 'actif' ? 'success' : 
                              status === 'expiré' ? 'danger' : 'warning'
                            }
                          >
                            {status === 'actif' ? 'Actif' : 
                             status === 'expiré' ? 'Expiré' : 'Limite atteinte'}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Copier le code</Tooltip>}
                          >
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-2"
                              onClick={() => handleCopy(code.code)}
                            >
                              <Copy />
                            </Button>
                          </OverlayTrigger>
                          
                          {status === 'expiré' && (
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Renouveler le code</Tooltip>}
                            >
                              <Button 
                                variant="outline-secondary" 
                                size="sm" 
                                className="me-2"
                                onClick={() => renewCode(code.id)}
                              >
                                <ArrowRepeat />
                              </Button>
                            </OverlayTrigger>
                          )}
                          
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Supprimer le code</Tooltip>}
                          >
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => {
                                setSelectedCode(code);
                                setShowDeleteModal(true);
                              }}
                            >
                              <TrashFill />
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
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

      {/* Modale de génération de code */}
      <Modal 
        show={showGenerateModal} 
        onHide={() => setShowGenerateModal(false)} 
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Générer un nouveau code d'accès</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3 mb-4">
              <Col md={12}>
                <Form.Group controlId="classSelection">
                  <Form.Label>Classe associée</Form.Label>
                  <Form.Select
                    value={newCode.classe}
                    onChange={(e) => setNewCode({...newCode, classe: e.target.value})}
                  >
                    <option value="">Sélectionnez une classe</option>
                    <option>Terminale S</option>
                    <option>1ère D</option>
                    <option>4ème B</option>
                    <option>3ème A</option>
                    <option>2nde C</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
  <Form.Group controlId="startDateTime">
    <Form.Label>Date et heure de début</Form.Label>
    <div className="d-flex gap-2">
      <Form.Control
        type="date"
        value={newCode.dateDebut ? format(new Date(newCode.dateDebut), 'yyyy-MM-dd') : ''}
        onChange={(e) => {
          const date = e.target.value;
          const time = newCode.dateDebut ? format(new Date(newCode.dateDebut), 'HH:mm') : '00:00';
          setNewCode({
            ...newCode,
            dateDebut: new Date(`${date}T${time}`)
          });
        }}
        min={format(new Date(), 'yyyy-MM-dd')}
      />
      <Form.Control
        type="time"
        value={newCode.dateDebut ? format(new Date(newCode.dateDebut), 'HH:mm') : '00:00'}
        onChange={(e) => {
          const time = e.target.value;
          const date = newCode.dateDebut ? format(new Date(newCode.dateDebut), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
          setNewCode({
            ...newCode,
            dateDebut: new Date(`${date}T${time}`)
          });
        }}
      />
    </div>
  </Form.Group>
</Col>

<Col md={6}>
  <Form.Group controlId="expirationDateTime">
    <Form.Label>Date et heure d'expiration</Form.Label>
    <div className="d-flex gap-2">
      <Form.Control
        type="date"
        value={newCode.dateExpiration ? format(new Date(newCode.dateExpiration), 'yyyy-MM-dd') : ''}
        onChange={(e) => {
          const date = e.target.value;
          const time = newCode.dateExpiration ? format(new Date(newCode.dateExpiration), 'HH:mm') : '23:59';
          setNewCode({
            ...newCode,
            dateExpiration: new Date(`${date}T${time}`)
          });
        }}
        min={newCode.dateDebut ? format(new Date(newCode.dateDebut), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
      />
      <Form.Control
        type="time"
        value={newCode.dateExpiration ? format(new Date(newCode.dateExpiration), 'HH:mm') : '23:59'}
        onChange={(e) => {
          const time = e.target.value;
          const date = newCode.dateExpiration ? format(new Date(newCode.dateExpiration), 'yyyy-MM-dd') : (newCode.dateDebut ? format(new Date(newCode.dateDebut), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
          setNewCode({
            ...newCode,
            dateExpiration: new Date(`${date}T${time}`)
          });
        }}
      />
    </div>
  </Form.Group>
</Col>
              
              <Col md={12}>
                <Form.Group controlId="maxUses">
                  <Form.Label>
                    <span>Nombre maximum d'utilisations </span>
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip>
                          Nombre maximum de fois que ce code peut être utilisé par les élèves
                        </Tooltip>
                      }
                    >
                      <InfoCircleFill className="text-muted ms-1" size={14} />
                    </OverlayTrigger>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={newCode.utilisationsMax}
                    onChange={(e) => setNewCode({...newCode, utilisationsMax: e.target.value})}
                    min="1"
                  />
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group controlId="generationMethod">
                  <Form.Label>Méthode de génération</Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check
                      type="radio"
                      id="auto-generate"
                      label="Génération automatique"
                      name="generateMethod"
                      checked={newCode.generateMethod === 'auto'}
                      onChange={() => setNewCode({...newCode, generateMethod: 'auto'})}
                    />
                    <Form.Check
                      type="radio"
                      id="manual-generate"
                      label="Code personnalisé"
                      name="generateMethod"
                      checked={newCode.generateMethod === 'manual'}
                      onChange={() => setNewCode({...newCode, generateMethod: 'manual'})}
                    />
                  </div>
                </Form.Group>
                
                {newCode.generateMethod === 'manual' && (
                  <Form.Group controlId="customCode" className="mt-3">
                    <Form.Label>Votre code personnalisé</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Entrez un code de 6 caractères"
                      maxLength="6"
                      pattern="[A-Z0-9]{6}"
                      title="6 caractères alphanumériques majuscules"
                    />
                    <Form.Text className="text-muted">
                      Le code doit contenir exactement 6 caractères (lettres majuscules et chiffres)
                    </Form.Text>
                  </Form.Group>
                )}
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGenerateModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="success" 
            onClick={generateNewCode}
            disabled={!newCode.classe}
          >
            Générer le code
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modale de suppression */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)} 
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer le code <strong>{selectedCode?.code}</strong> ?
          <div className="alert alert-warning mt-3">
            <XCircleFill className="me-2" />
            Cette action est irréversible. Les élèves ne pourront plus utiliser ce code.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDelete(selectedCode?.id)}
          >
            Confirmer la suppression
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CodeAccessPage;