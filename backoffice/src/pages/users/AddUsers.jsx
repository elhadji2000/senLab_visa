/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { FaAsterisk, FaUserPlus, FaCheck } from 'react-icons/fa';
import { addUser } from '../../api/users.api';
import './AddUsers.css';
import { Import } from 'lucide-react';

function AddUsers() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: 'Default@123', // Mot de passe plus sécurisé par défaut
    status: 'false',
    role: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    const { prenom, nom, email, telephone, role, status } = formData;
    if (!prenom || !nom || !email || !telephone || !role || !status) {
      setSubmitStatus({ success: false, message: 'Veuillez remplir tous les champs obligatoires.' });
      setIsSubmitting(false);
      return;
    }

    try {
      //const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      const response = await addUser(formData);

      setSubmitStatus({ 
        success: true, 
        message: 'Utilisateur créé avec succès !' 
      });
      
      // Réinitialisation du formulaire après 2 secondes
      setTimeout(() => {
        setFormData({
          prenom: '',
          nom: '',
          email: '',
          telephone: '',
          password: 'Default@123',
          status: 'false',
          role: '',
        });
        setIsSubmitting(false);
      }, 2000);

    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Erreur lors de la création de l'utilisateur";
      setSubmitStatus({ success: false, message: errorMessage });
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="add-user-container">
      <div className="form-header">
        <h2 className="form-title">
          <FaUserPlus className="me-2" />
          Nouvel Utilisateur
        </h2>
        <p className="form-subtitle">Remplissez les informations pour créer un nouveau compte</p>
      </div>

      {submitStatus.message && (
        <Alert variant={submitStatus.success ? 'success' : 'danger'} className="mb-4">
          {submitStatus.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className="user-form">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-4 form-group-custom">
              <Form.Label className="form-label">
                Prénom <FaAsterisk className="text-danger" size={8} />
              </Form.Label>
              <Form.Control
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                type="text"
                placeholder="Modou"
                className="form-input"
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-4 form-group-custom">
              <Form.Label className="form-label">
                Nom <FaAsterisk className="text-danger" size={8} />
              </Form.Label>
              <Form.Control
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                type="text"
                placeholder="Dupont"
                className="form-input"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-4 form-group-custom">
              <Form.Label className="form-label">
                Email <FaAsterisk className="text-danger" size={8} />
              </Form.Label>
              <Form.Control
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="jean.dupont@senlab.edu.sn"
                className="form-input"
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-4 form-group-custom">
              <Form.Label className="form-label">
                Téléphone <FaAsterisk className="text-danger" size={8} />
              </Form.Label>
              <Form.Control
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                type="tel"
                placeholder="0612345678"
                className="form-input"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-4 form-group-custom">
              <Form.Label className="form-label">
                Rôle <FaAsterisk className="text-danger" size={8} />
              </Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Sélectionnez un rôle</option>
                <option value="admin">Admin</option>
                <option value="professeur">Professeur</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-4 form-group-custom">
              <Form.Label className="form-label">
                Statut <FaAsterisk className="text-danger" size={8} />
              </Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="true">Actif</option>
                <option value="false">Inactif</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div className="form-footer">
          <Button 
            variant="primary" 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'En cours...'
            ) : (
              <>
                <FaCheck className="me-2" />
                Créer l'utilisateur
              </>
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default AddUsers;