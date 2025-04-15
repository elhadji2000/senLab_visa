import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

function Login() {
  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col md={4}>
          <Card className="shadow">
            <Card.Body>
              <div className="text-center mb-4">
                {/* Ton logo au milieu */}
                <img
                  src="/src/logo-uadb.png" // Remplace par le chemin réel vers ton logo
                  alt="Logo"
                  style={{ maxWidth: '150px' }}
                  className="mb-3"
                />
                <h5>Connexion à l'espace admin</h5>
              </div>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Entrez votre email" />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control type="password" placeholder="Mot de passe" />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Se connecter
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
