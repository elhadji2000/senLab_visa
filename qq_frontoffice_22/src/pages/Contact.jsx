import React from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import './css/Contact.css';

// Images
const contactHero = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";
const locationMap = "https://maps.googleapis.com/maps/api/staticmap?center=14.6928,-17.4466&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7C14.6928,-17.4466&key=YOUR_API_KEY";

function Contact() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    // Ici vous ajouteriez votre logique d'envoi réel
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero text-white text-center">
        <div className="hero-overlay"></div>
        <Container>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Contactez <span className="text-warning">SenLab</span>
          </motion.h1>
          <motion.p
            className="lead"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Nous sommes à votre écoute pour toute question ou collaboration
          </motion.p>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Row className="g-4">
            {/* Contact Form */}
            <Col lg={7}>
              <Card className="border-0 shadow-lg">
                <Card.Body className="p-4 p-md-5">
                  <h2 className="mb-4">
                    <FaPaperPlane className="me-2 text-primary" />
                    Envoyez-nous un message
                  </h2>
                  
                  {submitted && (
                    <Alert variant="success" className="mt-3">
                      Merci ! Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group controlId="name">
                          <Form.Label>Votre nom</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Votre nom complet"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="email">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="exemple@email.com"
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group controlId="subject">
                          <Form.Label>Sujet</Form.Label>
                          <Form.Control
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            placeholder="Objet de votre message"
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group controlId="message">
                          <Form.Label>Message</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            placeholder="Décrivez votre demande en détail..."
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button 
                            variant="primary" 
                            type="submit" 
                            size="lg"
                            className="w-100 py-3"
                          >
                            Envoyer le message
                          </Button>
                        </motion.div>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Contact Info */}
            <Col lg={5}>
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg h-100">
                  <Card.Body className="p-4 p-md-5">
                    <h2 className="mb-4">
                      Nos informations
                    </h2>
                    
                    <div className="contact-info-item">
                      <div className="contact-icon bg-primary">
                        <FaMapMarkerAlt />
                      </div>
                      <div>
                        <h5>Adresse</h5>
                        <p>Université Cheikh Anta Diop, Dakar, Sénégal</p>
                      </div>
                    </div>

                    <div className="contact-info-item">
                      <div className="contact-icon bg-success">
                        <FaEnvelope />
                      </div>
                      <div>
                        <h5>Email</h5>
                        <p>contact@senlab.edu.sn</p>
                      </div>
                    </div>

                    <div className="contact-info-item">
                      <div className="contact-icon bg-warning">
                        <FaPhone />
                      </div>
                      <div>
                        <h5>Téléphone</h5>
                        <p>+221 33 800 00 00</p>
                      </div>
                    </div>

                    <div className="contact-info-item">
                      <div className="contact-icon bg-info">
                        <FaClock />
                      </div>
                      <div>
                        <h5>Heures d'ouverture</h5>
                        <p>Lundi - Vendredi: 8h - 18h</p>
                        <p>Samedi: 9h - 13h</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="mb-3">Nous suivre</h5>
                      <div className="social-links">
                        <a href="#" className="facebook"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" className="twitter"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="linkedin"><i className="fab fa-linkedin-in"></i></a>
                        <a href="#" className="youtube"><i className="fab fa-youtube"></i></a>
                      </div>
                    </div>

                    <div className="mt-4">
                      <img 
                        src={locationMap} 
                        alt="Localisation de SenLab" 
                        className="img-fluid rounded shadow-sm" 
                      />
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.div>
      </Container>

      {/* FAQ Section */}
      <div className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Questions fréquentes</h2>
          <Row className="g-4">
            {[
              {
                question: "Comment accéder à la plateforme SenLab?",
                answer: "SenLab est accessible via notre site web sur tous les appareils. Une inscription gratuite est nécessaire pour accéder à toutes les fonctionnalités."
              },
              {
                question: "Est-ce vraiment gratuit?",
                answer: "Oui, la plateforme est entièrement gratuite pour tous les élèves et enseignants sénégalais, grâce au soutien de nos partenaires."
              },
              {
                question: "Puis-je utiliser SenLab sur mon téléphone?",
                answer: "Absolument! SenLab est optimisé pour les mobiles et fonctionne sur tous les smartphones modernes."
              },
              {
                question: "Comment contribuer au projet?",
                answer: "Nous accueillons les contributions des enseignants et chercheurs. Contactez-nous directement pour discuter des possibilités de collaboration."
              }
            ].map((item, index) => (
              <Col md={6} key={index}>
                <motion.div
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
                      <Card.Title>{item.question}</Card.Title>
                      <Card.Text>{item.answer}</Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Contact;