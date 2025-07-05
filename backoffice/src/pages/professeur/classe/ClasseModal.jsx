import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';

const niveaux = ['6e', '5e', '4e', '3e', '2nde', '1ère', 'Terminale'];

const ClasseModal = ({ show, handleClose, handleSave, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    nom_classe: '',
    niveau: '',
    annee_scolaire: '',
    etablissement: '',
  });

  const [error, setError] = useState('');

  // Remplir le formulaire en mode édition
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        nom_classe: '',
        niveau: '',
        annee_scolaire: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        etablissement: '',
      });
    }
    setError('');
  }, [show, initialData, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = () => {
    // Validation simple
    if (!formData.nom_classe || !formData.niveau || !formData.annee_scolaire) {
      return setError("Tous les champs obligatoires doivent être remplis.");
    }
    handleSave(formData);
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="text-primary">
          {isEditing ? 'Modifier la classe' : 'Ajouter une classe'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nom de la classe *</Form.Label>
            <Form.Control
              type="text"
              name="nom_classe"
              value={formData.nom_classe}
              onChange={handleChange}
              placeholder="ex : Terminale S1"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Niveau *</Form.Label>
                <Form.Select name="niveau" value={formData.niveau} onChange={handleChange}>
                  <option value="">-- Choisir un niveau --</option>
                  {niveaux.map((niv) => (
                    <option key={niv} value={niv}>{niv}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Année scolaire *</Form.Label>
                <Form.Control
                  type="text"
                  name="annee_scolaire"
                  value={formData.annee_scolaire}
                  onChange={handleChange}
                  placeholder="ex : 2024-2025"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-2">
            <Form.Label>Établissement</Form.Label>
            <Form.Control
              type="text"
              name="etablissement"
              value={formData.etablissement}
              onChange={handleChange}
              placeholder="Nom de l'établissement"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="primary" onClick={submit}>
          {isEditing ? 'Mettre à jour' : 'Créer'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClasseModal;
