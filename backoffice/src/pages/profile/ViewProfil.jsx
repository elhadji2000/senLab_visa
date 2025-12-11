import React, { useContext, useState } from "react";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Modal, 
  Form,
  Alert,
  Spinner
} from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import { updatePassword } from "../../api/users.api";

function ViewProfil() {
  const { user } = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    ancienPassword: "",
    nouveauPassword: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
    setPasswordData({
      ancienPassword: "",
      nouveauPassword: "",
      confirmPassword: ""
    });
    setMessage({ type: "", text: "" });
    setLoading(false);
  };

  const handleShowModal = () => setShowModal(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({ type: "", text: "" });

    // Validations locales
    if (passwordData.nouveauPassword !== passwordData.confirmPassword) {
      setMessage({
        type: "danger",
        text: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    if (passwordData.nouveauPassword.length < 6) {
      setMessage({
        type: "danger",
        text: "Le nouveau mot de passe doit contenir au moins 6 caractères.",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await updatePassword(user._id, passwordData);
      console.log("ID utilisé pour changer mot de passe:", user._id);

      setMessage({
        type: "success",
        text: res.data.message || "Mot de passe modifié avec succès.",
      });

      // Fermeture du modal après succès
      setTimeout(() => {
        handleCloseModal();
        localStorage.removeItem("token");
        window.location.reload();
      }, 2500);

    } catch (error) {
      console.error("Erreur API mot de passe :", error);

      const errorMsg =
        error.response?.data?.message ||
        "Une erreur est survenue lors du changement de mot de passe.";

      setMessage({
        type: "danger",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center py-3" style={{ minHeight: "80vh" }}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6}>
          <Card className="shadow-sm border-0 rounded-3" style={{ maxWidth: "500px", margin: "0 auto" }}>
            <Card.Header className="bg-primary text-white rounded-top-3 py-3 px-4">
              <h4 className="text-center mb-0 fw-normal">Mon Profil</h4>
            </Card.Header>
            
            <Card.Body className="p-4" style={{ minHeight: "auto" }}>
              {/* Avatar/Initiales */}
              <div className="text-center mb-4">
                <div 
                  className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center"
                  style={{ 
                    width: "80px", 
                    height: "80px",
                    fontSize: "2rem",
                    color: "white"
                  }}
                >
                  {user.prenom?.charAt(0) || "U"}{user.nom?.charAt(0) || "S"}
                </div>
                <h5 className="mt-3 mb-1 fw-bold">
                  {user.prenom || "Prénom"} {user.nom || "Nom"}
                </h5>
                <p className="text-muted small">{user.role || "Utilisateur"}</p>
              </div>

              {/* Informations utilisateur */}
              <div className="mb-4">
                <h6 className="border-bottom pb-2 mb-3 fw-bold">Informations personnelles</h6>
                
                <div className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-muted small">Email</span>
                  </div>
                  <div className="p-2 bg-light rounded">
                    {user.email || "Non renseigné"}
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-muted small">Téléphone</span>
                  </div>
                  <div className="p-2 bg-light rounded">
                    {user.telephone || "Non renseigné"}
                  </div>
                </div>
                
                {user.adresse && (
                  <div className="mb-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-muted small">Adresse</span>
                    </div>
                    <div className="p-2 bg-light rounded">
                      {user.adresse}
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton Modifier mot de passe aligné à droite */}
              <div className="text-end mt-3 pt-2 border-top">
                <Button 
                  variant="outline-primary" 
                  onClick={handleShowModal}
                  size="sm"
                  className="px-3"
                >
                  <i className="bi bi-key me-1"></i>
                  Modifier mot de passe
                </Button>
              </div>
            </Card.Body>
            
            {/* Dernière connexion alignée à droite */}
            <Card.Footer className="bg-light text-end py-2 px-4">
              <small className="text-muted">
                Dernière connexion : {new Date().toLocaleDateString()}
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* Modal pour modifier le mot de passe */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton className="bg-primary text-white py-3">
          <Modal.Title className="fs-6">
            <i className="bi bi-key me-2"></i>
            Modifier mot de passe
          </Modal.Title>
        </Modal.Header>
        
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="py-3">
            {message.text && (
              <Alert 
                variant={message.type} 
                className="py-2 mb-3" 
                onClose={() => setMessage({ type: "", text: "" })} 
                dismissible
              >
                <small className="d-flex align-items-center">
                  {message.type === "success" ? (
                    <i className="bi bi-check-circle-fill me-2"></i>
                  ) : (
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  )}
                  {message.text}
                </small>
              </Alert>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Mot de passe actuel</Form.Label>
              <Form.Control
                type="password"
                name="ancienPassword"
                size="sm"
                value={passwordData.ancienPassword}
                onChange={handleChange}
                placeholder="Mot de passe actuel"
                required
                disabled={loading}
                isInvalid={message.type === "danger" && message.text.includes("actuel")}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Nouveau mot de passe</Form.Label>
              <Form.Control
                type="password"
                name="nouveauPassword"
                size="sm"
                value={passwordData.nouveauPassword}
                onChange={handleChange}
                placeholder="Nouveau mot de passe"
                required
                disabled={loading}
                isInvalid={message.type === "danger" && message.text.includes("nouveau")}
              />
              <Form.Text className="text-muted small">
                Minimum 6 caractères
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Confirmer le mot de passe</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                size="sm"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmez le mot de passe"
                required
                disabled={loading}
                isInvalid={message.type === "danger" && message.text.includes("correspondent")}
              />
            </Form.Group>
          </Modal.Body>
          
          <Modal.Footer className="py-2">
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={handleCloseModal}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  En cours...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default ViewProfil;