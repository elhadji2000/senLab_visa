import React from 'react';
import { Container, Row, Col, Card, Badge, Image } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaFlask, FaAtom, FaChartLine, FaUserGraduate } from 'react-icons/fa';
import './css/Apropos.css';

// Images (remplacez par vos propres images)
const teamPhoto = "https://images.unsplash.com/photo-1522071820081-009f0129c71c";
const labPhoto = "/src/assets/logo-uadb.png";
const stemPhoto = "/src/assets/senLab2.jpg";

function Apropos() {
  const teamMembers = [
    {
      name: "Votre Nom",
      role: "Porteur du projet",
      bio: "Étudiant en Master Informatique, spécialisé dans les technologies éducatives",
      photo: "/src/assets/logo2.png"
    },
    {
      name: "Encadreur Académique",
      role: "Directeur de mémoire",
      bio: "Professeur en Sciences de l'Éducation, expert en pédagogie numérique",
      photo: "/src/assets/prof.jpg"
    },
    {
      name: "Collaborateur",
      role: "Expert STEM",
      bio: "Enseignant-chercheur en Physique, spécialiste des laboratoires virtuels",
      photo: "/src/assets/uidt.png"
    }
  ];

  return (
    <div className="apropos-page">
      {/* Hero Section */}
      <div className="apropos-hero text-white text-center">
        <Container>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            À Propos de <span className="text-warning">SenLab</span>
          </motion.h1>
          <motion.p 
            className="lead"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Plateforme centrale de laboratoire virtuel pour améliorer l'enseignement STEM au Sénégal
          </motion.p>
        </Container>
      </div>

      {/* Contexte du Projet */}
      <Container className="py-5">
        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Image src={stemPhoto} fluid rounded className="shadow-lg" />
            </motion.div>
          </Col>
          <Col lg={6}>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4">
                <FaFlask className="me-2 text-primary" />
                Contexte du Mémoire
              </h2>
              <p>
                Ce projet s'inscrit dans le cadre de mon mémoire de Master en Informatique avec pour thème : 
                <strong>"Mise en place d'une plateforme centrale de laboratoire virtuel pour améliorer l'enseignement STEM au Sénégal"</strong>.
              </p>
              <p>
                Face aux défis d'accès aux équipements scientifiques dans les établissements sénégalais, SenLab propose une solution innovante 
                pour démocratiser l'apprentissage pratique des sciences à travers des simulations interactives.
              </p>
              <Badge bg="primary" className="me-2">STEM</Badge>
              <Badge bg="success" className="me-2">Éducation</Badge>
              <Badge bg="warning" className="me-2">Innovation</Badge>
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* Objectifs du Projet */}
      <div className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">
            <FaChartLine className="me-2 text-primary" />
            Objectifs du Projet
          </h2>
          <Row className="g-4">
            {[
              {
                title: "Accessibilité",
                content: "Rendre les expériences scientifiques accessibles à tous les élèves, même dans les régions éloignées"
              },
              {
                title: "Pédagogie Innovante",
                content: "Transformer l'enseignement des sciences par l'expérimentation virtuelle interactive"
              },
              {
                title: "Standardisation",
                content: "Offrir une plateforme centralisée conforme aux programmes éducatifs sénégalais"
              },
              {
                title: "Réduction des Coûts",
                content: "Diminuer les investissements nécessaires en matériel de laboratoire physique"
              }
            ].map((item, index) => (
              <Col md={6} lg={3} key={index}>
                <motion.div
                  whileHover={{ y: -10 }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-100 shadow-sm border-0">
                    <Card.Body className="text-center">
                      <div className="objective-icon mb-3">
                        <FaAtom className="text-primary" size={30} />
                      </div>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Text>{item.content}</Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Méthodologie */}
      <Container className="py-5">
        <h2 className="text-center mb-5">
          <FaFlask className="me-2 text-primary" />
          Méthodologie de Développement
        </h2>
        <Row>
          <Col lg={8} className="mx-auto">
            <div className="timeline">
              {[
                {
                  step: "1",
                  title: "Analyse des Besoins",
                  content: "Enquête auprès des enseignants et élèves pour identifier les difficultés"
                },
                {
                  step: "2",
                  title: "Conception",
                  content: "Définition de l'architecture technique et pédagogique de la plateforme"
                },
                {
                  step: "3",
                  title: "Développement",
                  content: "Implémentation des fonctionnalités principales et simulations"
                },
                {
                  step: "4",
                  title: "Validation",
                  content: "Tests avec des établissements pilotes et ajustements"
                }
              ].map((item, index) => (
                <motion.div 
                  className="timeline-item"
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="timeline-step">{item.step}</div>
                  <div className="timeline-content">
                    <h5>{item.title}</h5>
                    <p>{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Équipe */}
      <div className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">
            <FaUserGraduate className="me-2 text-primary" />
            Notre Équipe
          </h2>
          <Row className="g-4 justify-content-center">
            {teamMembers.map((member, index) => (
              <Col md={6} lg={4} key={index}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-100 border-0 shadow-sm team-card">
                    <div className="team-img-container">
                      <Image src={member.photo} roundedCircle className="team-img" />
                    </div>
                    <Card.Body className="text-center">
                      <Card.Title>{member.name}</Card.Title>
                      <Card.Subtitle className="mb-3 text-muted">{member.role}</Card.Subtitle>
                      <Card.Text>{member.bio}</Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Perspectives */}
      <Container className="py-5">
        <h2 className="text-center mb-4">Perspectives du Projet</h2>
        <Row className="align-items-center">
          <Col lg={6} className="order-lg-2 mb-4 mb-lg-0">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Image src={labPhoto} fluid rounded className="shadow-lg" />
            </motion.div>
          </Col>
          <Col lg={6} className="order-lg-1">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <ul className="perspectives-list">
                <li>Intégration avec les programmes officiels du Ministère de l'Éducation</li>
                <li>Extension à d'autres disciplines scientifiques</li>
                <li>Version mobile pour un accès hors ligne</li>
                <li>Collaboration avec les universités sénégalaises</li>
                <li>Système de suivi des compétences acquises</li>
              </ul>
              <div className="mt-4">
                <h5>Ce projet contribue à :</h5>
                <ul>
                  <li>L'ODD 4 : Éducation de qualité</li>
                  <li>La stratégie "Sénégal numérique 2025"</li>
                  <li>La modernisation des méthodes pédagogiques</li>
                </ul>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Apropos;