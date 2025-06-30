import React from 'react';
import { Container, Button, Card, Row, Col, Carousel } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './css/Accueil.css';
import studentsLab from '../assets/senLab2.jpg';
import virtualExp from '../assets/senLab3.jpg';

// Images demo (à adapter)
const images = {
  studentsLab,
  virtualExp,
};

const subjects = [
  {
    name: 'Mathématiques',
    color: '#4e73df',
    icon: 'fa-square-root-alt',
    image:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1470&q=80',
    desc: 'Visualisez les concepts abstraits et résolvez des problèmes interactifs',
  },
  {
    name: 'Physique',
    color: '#1cc88a',
    icon: 'fa-atom',
    image:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1470&q=80',
    desc: "Expérimentez avec les lois du mouvement, l'électricité et plus",
  },
  {
    name: 'Chimie',
    color: '#36b9cc',
    icon: 'fa-flask',
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1470&q=80',
    desc: 'Manipulez des molécules et observez des réactions en temps réel',
  },
  {
    name: 'Biologie',
    color: '#f6c23e',
    icon: 'fa-dna',
    image:
      'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?auto=format&fit=crop&w=1453&q=80',
    desc: 'Explorez le corps humain et les écosystèmes en 3D',
  },
];

function Accueil() {
  const navigate = useNavigate();

  return (
    <div className="accueil-page">
      {/* Hero */}
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <motion.h1 className="display-3 fw-bold text-white text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}>
          Bienvenue sur <span className="text-warning">SenLab</span>
        </motion.h1>
        <motion.p className="lead text-light text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}>
          Le laboratoire virtuel des sciences au Sénégal
        </motion.p>
        <motion.div className="d-flex gap-3 justify-content-center mt-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 }}>
          <Button variant="warning" size="lg" onClick={() => navigate('/experiences')}>Démarrer</Button>
          <Button variant="outline-light" size="lg" onClick={() => navigate('/about')}>En savoir plus</Button>
        </motion.div>
      </header>

      {/* Pourquoi SenLab */}
      <Container className="py-5">
        <Row className="align-items-center">
          <Col md={6} className="mb-4">
            <motion.img
              src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1472&q=80"
              className="img-fluid rounded shadow-lg"
              alt="science senegal"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
            />
          </Col>
          <Col md={6}>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="mb-4 text-primary">Pourquoi SenLab ?</h2>
              <ul className="list-unstyled fs-5">
                <li><i className="fas fa-university text-warning me-2"></i> Accès égalitaire partout au pays</li>
                <li><i className="fas fa-leaf text-success me-2"></i> Respect de l'environnement</li>
                <li><i className="fas fa-shield-alt text-danger me-2"></i> Apprentissage sans danger</li>
                <li><i className="fas fa-sync-alt text-info me-2"></i> Adapté au programme national</li>
              </ul>
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* Matières */}
      <div className="subjects-section py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Nos matières scientifiques</h2>
          <Row className="g-4">
            {subjects.map((s, i) => (
              <Col md={6} lg={3} key={i}>
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Card className="subject-card border-0 rounded h-100">
                    <Card.Img variant="top" src={s.image} className="rounded-top" />
                    <Card.Body className="text-center">
                      <div className="subject-icon mb-3 rounded-circle text-white d-flex align-items-center justify-content-center mx-auto" style={{ backgroundColor: s.color, width: 60, height: 60 }}>
                        <i className={`fas ${s.icon}`}></i>
                      </div>
                      <Card.Title className="h5 fw-bold">{s.name}</Card.Title>
                      <Card.Text>{s.desc}</Card.Text>
                      <Button variant="outline-primary" onClick={() => navigate(`/matieres/${s.name.toLowerCase()}`)}>Découvrir</Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Carousel */}
      <div className="features-section py-5">
        <Container>
          <h2 className="text-center mb-5">Comment SenLab innove</h2>
          <Carousel indicators={false} interval={4000} fade>
            <Carousel.Item>
              <Row className="align-items-center">
                <Col md={6}>
                  <img src={images.virtualExp} alt="Expérience" className="img-fluid rounded" />
                </Col>
                <Col md={6}>
                  <h3>Un labo dans votre poche</h3>
                  <p className="lead">Accédez à des outils scientifiques avancés depuis n'importe où.</p>
                </Col>
              </Row>
            </Carousel.Item>
            <Carousel.Item>
              <Row className="align-items-center">
                <Col md={6}>
                  <img src={images.studentsLab} alt="Collaboration" className="img-fluid rounded" />
                </Col>
                <Col md={6}>
                  <h3>Collaboration à distance</h3>
                  <p className="lead">Travaillez en équipe et partagez vos résultats instantanément.</p>
                </Col>
              </Row>
            </Carousel.Item>
          </Carousel>
        </Container>
      </div>

      {/* Call To Action */}
      <div className="cta-section bg-warning text-center text-dark py-5">
        <Container>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}>
            <h2 className="display-5 fw-bold mb-3">Transformez votre apprentissage</h2>
            <p className="lead mb-4">Inscrivez-vous gratuitement et accédez à des expériences immersives.</p>
            <Button variant="dark" size="lg" onClick={() => navigate('/register')}>Créer un compte</Button>
          </motion.div>
        </Container>
      </div>
    </div>
  );
}

export default Accueil;
