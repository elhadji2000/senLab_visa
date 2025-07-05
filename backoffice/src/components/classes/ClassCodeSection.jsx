import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import { FaPlus, FaTrash, FaLink } from "react-icons/fa";
import {
  getClassCodes,
  createClassCode,
  deleteClassCode,
} from "../../api/classes";
import { toast } from "react-toastify";
import moment from "moment";
import { fetchQuizzes } from "../../api/quizAPI"; // à adapter selon ton arborescence

const ClassCodeSection = ({ classId }) => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState(null);

  const [quizzList, setQuizzList] = useState([]);
  const [newCode, setNewCode] = useState({
    nom: "",
    date_debut: "",
    expiration: "",
    lienTP: "",
    quiz: "", // id du quizz sélectionné
  });

  const loadCodes = async () => {
    try {
      setLoading(true);
      const res = await getClassCodes(classId);
      setCodes(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadQuizz = async () => {
      try {
        const res = await fetchQuizzes(); // récupère tous les quizz
        const filtered = res.data.quizzes.filter((q) => q.isPublic === false);
        setQuizzList(filtered);
      } catch (err) {
        console.error("Erreur chargement des quizz", err);
      }
    };

    loadQuizz();
  }, []);

  useEffect(() => {
    loadCodes();
  }, [classId]);

  const handleAddCode = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...newCode,
        classe: classId, // on lie bien le code à la classe ici
      };

      const res = await createClassCode(payload);

      setCodes([...codes, res.data.codeClasse]); // attention à bien utiliser "codeClasse"
      setShowAddModal(false);

      // Réinitialisation du formulaire
      setNewCode({
        nom: "",
        date_debut: "",
        expiration: "",
        lienTP: "",
        quiz:"",
      });

      toast.success("Code ajouté avec succès !");
    } catch (err) {
      console.error("Erreur ajout code :", err);
      toast.error("Erreur lors de l'ajout du code");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClassCode(codeToDelete); // seulement l'ID du code

      // Mettre à jour la liste locale
      setCodes(codes.filter((code) => code._id !== codeToDelete));

      setShowDeleteModal(false);
      toast.success("Code supprimé avec succès !");
    } catch (err) {
      console.error("Erreur suppression code :", err);
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <>
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-light d-flex justify-content-between align-items-center">
          <strong>Codes d'accès ({codes.length})</strong>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus className="me-1" /> Ajouter
          </Button>
        </Card.Header>

        <Card.Body>
          {loading ? (
            <div className="text-center p-4">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : codes.length === 0 ? (
            <div className="text-center p-4 text-muted">
              Aucun code disponible
            </div>
          ) : (
            <Table responsive hover>
              <thead className="table-light">
                <tr>
                  <th>Nom</th>
                  <th>Code</th>
                  <th>Début</th>
                  <th>Expiration</th>
                  <th>Statut</th>
                  <th>Quizz</th>
                  <th>LienTP</th>
                  <th>Soumettre</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((code) => {
                  const now = moment();
                  const debut = moment(code.date_debut);
                  const fin = moment(code.expiration);

                  let statut = "En attente";
                  if (now.isBetween(debut, fin)) {
                    statut = "En cours";
                  } else if (now.isAfter(fin)) {
                    statut = "Expiré";
                  }

                  const statutVariant =
                    statut === "En cours"
                      ? "success"
                      : statut === "Expiré"
                      ? "danger"
                      : "secondary";

                  return (
                    <tr key={code._id}>
                      <td>{code.nom}</td>
                      <td>
                        <Badge bg="info">{code.code}</Badge>
                      </td>
                      <td>{moment(code.date_debut).format("DD/MM HH:mm")}</td>
                      <td>{moment(code.expiration).format("DD/MM HH:mm")}</td>
                      <td>
                        <Badge bg={statutVariant}>{statut}</Badge>
                      </td>
                      <td>{code.quiz?.titre || "N/A"}</td>
                      <td>
                        {code.lienTP ? (
                          <a
                            href={code.lienTP}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaLink />
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() =>
                            toast.info("Fonction soumettre à venir...")
                          }
                        >
                          Soumettre
                        </Button>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => {
                            setCodeToDelete(code._id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal d'ajout */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un code</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddCode}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nom du code</Form.Label>
              <Form.Control
                type="text"
                value={newCode.nom}
                onChange={(e) =>
                  setNewCode({ ...newCode, nom: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date de début</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newCode.date_debut}
                onChange={(e) =>
                  setNewCode({ ...newCode, date_debut: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date d'expiration</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newCode.expiration}
                onChange={(e) =>
                  setNewCode({ ...newCode, expiration: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quizz à associer</Form.Label>
              <Form.Select
                value={newCode.quiz}
                onChange={(e) =>
                  setNewCode({ ...newCode, quiz: e.target.value })
                }
                required
              >
                <option value="">-- Sélectionner un quizz --</option>
                {quizzList.map((q) => (
                  <option key={q._id} value={q._id}>
                    {q.titre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Lien TP (optionnel)</Form.Label>
              <Form.Control
                type="url"
                value={newCode.lienTP}
                onChange={(e) =>
                  setNewCode({ ...newCode, lienTP: e.target.value })
                }
                placeholder="https://..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Supprimer le code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer ce code ? Cette action est
          irréversible.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ClassCodeSection;
