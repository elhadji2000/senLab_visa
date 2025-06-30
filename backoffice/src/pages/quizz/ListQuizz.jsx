import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner, Alert, Button, Modal, Card, Badge, Form } from 'react-bootstrap';
import { EyeFill, PencilFill, TrashFill, PlusCircleFill, LockFill, UnlockFill } from 'react-bootstrap-icons';
import { fetchQuizzes, deleteQuiz, fetchQuizDetail, updateQuizVisibility } from '../../api/quizAPI';
import { useNavigate } from 'react-router-dom';

const ListQuizz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizDetail, setQuizDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterVisibility, setFilterVisibility] = useState('all');

  const navigate = useNavigate();

  // Niveaux scolaires exacts comme dans la base
  const niveauxScolaires = ['6e', '5e', '4e', '3e', '2nde', '1ère', 'Terminale'];

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const response = await fetchQuizzes();
        // Calcul du nombre de questions pour chaque quiz
        const quizzesWithCount = response.data.quizzes.map(quiz => ({
          ...quiz,
          questions_count: Array.isArray(quiz.questions) ? quiz.questions.length : 0
        }));
        setQuizzes(quizzesWithCount);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des quiz.");
        setLoading(false);
      }
    };
    loadQuizzes();
  }, []);

  const handleDelete = async () => {
    if (!selectedQuiz) return;
    try {
      await deleteQuiz(selectedQuiz._id);
      setQuizzes(quizzes.filter(q => q._id !== selectedQuiz._id));
      setShowDeleteModal(false);
    } catch (error) {
      alert("Erreur lors de la suppression.");
    }
  };

  const handleShowDetail = async (quizId) => {
    try {
      const response = await fetchQuizDetail(quizId);
      setQuizDetail({
        ...response.data,
        questions_count: response.data.questions ? response.data.questions.length : 0
      });
      setShowDetailModal(true);
    } catch (error) {
      alert("Erreur lors du chargement des détails du quiz.");
    }
  };

  const handleToggleVisibility = async (quizId, currentVisibility) => {
    try {
      await updateQuizVisibility(quizId, !currentVisibility);
      setQuizzes(quizzes.map(q => 
        q._id === quizId ? { ...q, is_public: !currentVisibility } : q
      ));
    } catch (error) {
      alert("Erreur lors de la mise à jour de la visibilité.");
    }
  };

  const getBadgeVariant = (niveau) => {
    // Couleurs par cycle scolaire
    if (['6e', '5e', '4e', '3e'].includes(niveau)) return 'primary'; // Collège - bleu
    if (['2nde', '1ère', 'Terminale'].includes(niveau)) return 'success'; // Lycée - vert
    return 'secondary'; // Par défaut
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.titre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || quiz.niveau === filterLevel;
    const matchesVisibility = filterVisibility === 'all' || 
      (filterVisibility === 'public' && quiz.isPublic) || 
      (filterVisibility === 'private' && !quiz.isPublic);
    
    return matchesSearch && matchesLevel && matchesVisibility;
  });

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 text-primary">Gestion des Quiz</h4>
            <Button 
              variant="primary" 
              onClick={() => navigate('/quizz/ajouter')}
              className="d-flex align-items-center"
            >
              <PlusCircleFill className="me-2" /> Ajouter un quiz
            </Button>
          </div>
        </Card.Header>
        
        <Card.Body>
          {/* Filtres de recherche */}
          <div className="mb-4">
            <div className="row g-3">
              <div className="col-md-5">
                <Form.Control
                  type="text"
                  placeholder="Rechercher par titre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <Form.Select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="form-select"
                >
                  <option value="all">Tous les niveaux</option>
                  <optgroup label="Collège">
                    {['6e', '5e', '4e', '3e'].map(niveau => (
                      <option key={niveau} value={niveau}>{niveau}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Lycée">
                    {['2nde', '1ère', 'Terminale'].map(niveau => (
                      <option key={niveau} value={niveau}>{niveau}</option>
                    ))}
                  </optgroup>
                </Form.Select>
              </div>
              <div className="col-md-2">
                <Form.Select
                  value={filterVisibility}
                  onChange={(e) => setFilterVisibility(e.target.value)}
                >
                  <option value="all">Tous</option>
                  <option value="public">Public</option>
                  <option value="private">Privé</option>
                </Form.Select>
              </div>
              <div className="col-md-2">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterLevel('all');
                    setFilterVisibility('all');
                  }}
                  className="w-100"
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Chargement des quiz...</p>
            </div>
          )}
          
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th style={{width: '5%'}}>#</th>
                    <th style={{width: '25%'}}>Titre</th>
                    <th style={{width: '15%'}}>Niveau</th>
                    <th style={{width: '10%'}}>Questions</th>
                    <th style={{width: '15%'}}>Visibilité</th>
                    <th style={{width: '15%'}}>Créé par</th>
                    <th style={{width: '15%'}} className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuizzes.map((quiz, index) => (
                    <tr key={quiz._id}>
                      <td className="align-middle">{index + 1}</td>
                      <td className="align-middle fw-semibold">{quiz.titre}</td>
                      <td className="align-middle">
                        <Badge bg={getBadgeVariant(quiz.niveau)} className="text-uppercase">
                          {quiz.niveau}
                        </Badge>
                      </td>
                      <td className="align-middle">
                        <Badge bg="info" pill>
                          {quiz.questionCount}
                        </Badge>
                      </td>
                      <td className="align-middle">
                        <Button 
                          variant={quiz.is_public ? "outline-success" : "outline-secondary"} 
                          size="sm"
                          onClick={() => handleToggleVisibility(quiz._id, quiz.is_public)}
                          className="d-flex align-items-center gap-1"
                        >
                          {quiz.isPublic ? <UnlockFill /> : <LockFill />}
                          {quiz.isPublic ? 'Public' : 'Privé'}
                        </Button>
                      </td>
                      <td className="align-middle">
                        {quiz.user?.prenom} {quiz.user?.nom}
                      </td>
                      <td className="align-middle text-end">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2" 
                          onClick={() => handleShowDetail(quiz._id)}
                          title="Voir les détails"
                        >
                          <EyeFill />
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          className="me-2" 
                          onClick={() => navigate(`/quizz/edit/${quiz._id}`)}
                          title="Modifier"
                        >
                          <PencilFill />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => { setSelectedQuiz(quiz); setShowDeleteModal(true); }}
                          title="Supprimer"
                        >
                          <TrashFill />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {filteredQuizzes.length === 0 && (
                <div className="text-center py-5">
                  <p className="text-muted">Aucun quiz trouvé</p>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => {
                      setSearchTerm('');
                      setFilterLevel('all');
                      setFilterVisibility('all');
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* MODAL DETAIL */}
      <Modal 
        show={showDetailModal} 
        onHide={() => setShowDetailModal(false)} 
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="text-primary">Détails du quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{maxHeight: '60vh', overflowY: 'auto'}}>
          {quizDetail ? (
            <div>
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h4 className="text-primary">{quizDetail.quiz.titre}</h4>
                    <p className="text-muted">{quizDetail.quiz.description}</p>
                  </div>
                  <Badge bg={quizDetail.quiz.isPublic ? "success" : "secondary"}>
                    {quizDetail.quiz.isPublic ? 'Public' : 'Privé'}
                  </Badge>
                </div>
                
                <div className="d-flex gap-3 mt-3 flex-wrap">
                  <div>
                    <span className="fw-semibold">Niveau :</span>{' '}
                    <Badge bg={getBadgeVariant(quizDetail.quiz.niveau)}>
                      {quizDetail.quiz.niveau}
                    </Badge>
                  </div>
                  <div>
                    <span className="fw-semibold">Questions :</span>{' '}
                    <Badge bg="info" pill>{quizDetail.questions_count}</Badge>
                  </div>
                  <div>
                    <span className="fw-semibold">Créé par :</span>{' '}
                    {quizDetail.quiz.user?.prenom} {quizDetail.quiz.user?.nom}
                  </div>
                </div>
              </div>

              <h5 className="mb-3 text-primary">Questions</h5>
              
              {quizDetail.questions && quizDetail.questions.length > 0 ? (
                quizDetail.questions.map((q, qi) => (
                  <Card key={q._id} className="mb-3 shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <span className="badge bg-primary me-2">Q{qi + 1}</span>
                        <h6 className="mb-0">{q.titre}</h6>
                      </div>
                      
                      <ul className="list-unstyled">
                        {q.options && q.options.map((opt, oi) => (
                          <li key={opt._id} className="mb-2 ps-3">
                            <div className={`d-flex align-items-center p-2 rounded ${opt.is_correct ? 'bg-success bg-opacity-10' : 'bg-light'}`}>
                              <span className="fw-semibold me-2">{opt.option}</span>
                              <span className="flex-grow-1">{opt.text}</span>
                              {opt.is_correct && (
                                <Badge bg="success" className="ms-2">Correct</Badge>
                              )}
                              <Badge bg="info" className="ms-2">Note: {opt.note}</Badge>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Alert variant="info">Aucune question dans ce quiz</Alert>
              )}
            </div>
          ) : (
            <div className="text-center py-3">
              <Spinner animation="border" variant="primary" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL SUPPRESSION */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)} 
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="text-danger">Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center mb-3">
            <div className="bg-danger bg-opacity-10 p-2 rounded me-3">
              <TrashFill className="text-danger" size={24} />
            </div>
            <div>
              <p className="mb-0 fw-semibold">Voulez-vous vraiment supprimer ce quiz ?</p>
              <p className="mb-0 text-muted">{selectedQuiz?.titre}</p>
            </div>
          </div>
          <p className="text-muted">Cette action est irréversible et supprimera toutes les données associées à ce quiz.</p>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
          <Button variant="danger" onClick={handleDelete}>Supprimer définitivement</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListQuizz;