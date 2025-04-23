import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaAsterisk, FaPen, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import './AddUsers.css';
// import { useNavigate } from 'react-router-dom'; // Décommente si tu veux rediriger

function AddUsers() {
  // const navigate = useNavigate(); // Décommente si tu veux rediriger

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: '123456', // mot de passe par défaut
    status: 'true',
    role: '',
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { prenom, nom, email, telephone, role } = formData;
    if (!prenom || !nom || !email || !telephone || !role) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (photo) {
        data.append('image', photo); // 'image' correspond au champ multer
      }

      const response = await axios.post('http://localhost:5000/api/users', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('✅ Utilisateur enregistré avec succès !');

      // Option : réinitialisation du formulaire
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        password: '123456',
        status: 'true',
        role: '',
      });
      setPhoto(null);
      setPhotoPreview(null);

      // Option : redirection
      // navigate('/liste-utilisateurs');
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l'enregistrement de l'utilisateur.");
    }
  };

  return (
    <Container className="my-5 p-4 shadow rounded bg-white">
      <h3 className="text-center mb-4">Créer un nouvel utilisateur</h3>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={3} className="text-center mb-3">
            <div className="profile-photo-container">
              <div className="photo-wrapper">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profil" className="profile-photo-circle" />
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

          <Col md={9}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    Prénom <FaAsterisk className="text-danger" size={8} />
                  </Form.Label>
                  <Form.Control
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    type="text"
                    placeholder="Entrez le prénom"
                    className="custom-input"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    Nom <FaAsterisk className="text-danger" size={8} />
                  </Form.Label>
                  <Form.Control
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    type="text"
                    placeholder="Entrez le nom"
                    className="custom-input"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    Email <FaAsterisk className="text-danger" size={8} />
                  </Form.Label>
                  <Form.Control
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="exemple@mail.com"
                    className="custom-input"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    Téléphone <FaAsterisk className="text-danger" size={8} />
                  </Form.Label>
                  <Form.Control
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    type="text"
                    placeholder="Numéro de téléphone"
                    className="custom-input"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    Rôle <FaAsterisk className="text-danger" size={8} />
                  </Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="custom-input"
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="admin">Admin</option>
                    <option value="professeur">Professeur</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    Statut <FaAsterisk className="text-danger" size={8} />
                  </Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="custom-input"
                    required
                  >
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
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default AddUsers;
