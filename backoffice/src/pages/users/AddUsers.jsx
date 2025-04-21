import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaAsterisk, FaPen, FaUserCircle } from 'react-icons/fa';
import './AddUsers.css';

function AddUsers() {
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  return (
    <Container className="my-5 p-4 shadow rounded bg-white">
      <h3 className="text-center mb-4">Créer un nouvel utilisateur</h3>

      <Row>
        <Col md={3} className="text-center mb-3">
          <div className="profile-photo-container">
            <div className="photo-wrapper">
              {photo ? (
                <img src={photo} alt="Profil" className="profile-photo-circle" />
              ) : (
                <FaUserCircle className="default-avatar" />
              )}
              <label htmlFor="fileUpload" className="edit-icon">
                <FaPen />
              </label>
              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </Col>
        {/* Formulaire à droite */}
        <Col md={9}>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Prénom <FaAsterisk className="text-danger" size={8} /></Form.Label>
                  <Form.Control className="custom-input" type="text" placeholder="Entrez le prénom" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Nom <FaAsterisk className="text-danger" size={8} /></Form.Label>
                  <Form.Control className="custom-input" type="text" placeholder="Entrez le nom" required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Email <FaAsterisk className="text-danger" size={8} /></Form.Label>
                  <Form.Control className="custom-input" type="email" placeholder="exemple@mail.com" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Téléphone <FaAsterisk className="text-danger" size={8} /></Form.Label>
                  <Form.Control className="custom-input" type="text" placeholder="Numéro de téléphone" required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
              <Form.Group className="mb-4">
                  <Form.Label>Rôle <FaAsterisk className="text-danger" size={8} /></Form.Label>
                  <Form.Select className="custom-input" required>
                    <option value="">-- Sélectionner --</option>
                    <option value="true">Admin</option>
                    <option value="false">Professeur</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Statut <FaAsterisk className="text-danger" size={8} /></Form.Label>
                  <Form.Select className="custom-input" required>
                    <option value="">-- Sélectionner --</option>
                    <option value="true">Actif</option>
                    <option value="false">Inactif</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end">
              <Button variant="primary" size="lg" type="submit">
                Enregistrer l'utilisateur
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default AddUsers;
