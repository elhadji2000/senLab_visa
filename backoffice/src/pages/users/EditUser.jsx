/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FaAsterisk, FaSave, FaArrowLeft } from 'react-icons/fa';
import { FaUserEdit } from 'react-icons/fa';
import { fetchUserById, updateUser } from '../../api/users.api';

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    role: '',
    status: 'false',
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await fetchUserById(id);
      const user = response.data;
      
      // Stocker les données originales pour détecter les changements
      setOriginalData({
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
        status: user.status.toString(),
      });

      // Mettre à jour le formulaire avec les données de l'utilisateur
      setFormData({
        prenom: user.prenom || '',
        nom: user.nom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        role: user.role || '',
        status: user.status.toString() || 'false',
      });
    } catch (err) {
      console.error(err);
      setSubmitStatus({ 
        success: false, 
        message: "Erreur lors du chargement de l'utilisateur" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Vérifier si des changements ont été faits
  const hasChanges = () => {
    if (!originalData) return false;
    
    return Object.keys(formData).some(key => {
      // Convertir en string pour la comparaison
      const currentValue = String(formData[key]);
      const originalValue = String(originalData[key] || '');
      return currentValue !== originalValue;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier si des changements ont été faits
    if (!hasChanges()) {
      setSubmitStatus({ 
        success: false, 
        message: "Aucune modification n'a été effectuée." 
      });
      return;
    }

    const { prenom, nom, email, telephone, role, status } = formData;
    if (!prenom || !nom || !email || !telephone || !role || !status) {
      setSubmitStatus({ 
        success: false, 
        message: 'Veuillez remplir tous les champs obligatoires.' 
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      // Préparer les données pour l'API
      const updateData = {
        prenom,
        nom,
        email,
        telephone,
        role,
        status: status === 'true',
      };

      const response = await updateUser(id, updateData);

      setSubmitStatus({ 
        success: true, 
        message: 'Utilisateur modifié avec succès !' 
      });

      // Mettre à jour les données originales
      setOriginalData({
        prenom,
        nom,
        email,
        telephone,
        role,
        status,
      });

      // Rediriger après 2 secondes en cas de succès
      setTimeout(() => {
        navigate('/users'); // Rediriger vers la liste des utilisateurs
      }, 2000);

    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || "Erreur lors de la modification de l'utilisateur";
      
      setSubmitStatus({ 
        success: false, 
        message: errorMessage 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/utilisateur/lister');
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="edit-user-container">
      <div className="form-header">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="form-title mb-0">
              <FaUserEdit className="me-2" />
              Modifier l'Utilisateur
            </h2>
            <p className="form-subtitle mb-0">
              Modifiez les informations de {formData.prenom} {formData.nom}
            </p>
          </div>
          <Button 
            variant="outline-secondary" 
            onClick={handleBack}
            className="d-flex align-items-center"
          >
            <FaArrowLeft className="me-2" />
            Retour
          </Button>
        </div>
      </div>

      {submitStatus.message && (
        <Alert 
          variant={submitStatus.success ? 'success' : 'danger'} 
          className="mb-4"
          dismissible
          onClose={() => setSubmitStatus({ success: null, message: '' })}
        >
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

        <div className="form-footer d-flex justify-content-between">
          <Button 
            variant="outline-secondary" 
            onClick={handleBack}
            disabled={isSubmitting}
          >
            <FaArrowLeft className="me-2" />
            Annuler
          </Button>
          
          <Button 
            variant="primary" 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting || !hasChanges()}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Enregistrement...
              </>
            ) : (
              <>
                <FaSave className="me-2" />
                Enregistrer les modifications
              </>
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default EditUser;