import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaCalculator, FaAtom, FaFlask, FaDna, FaGlobeAmericas, FaChalkboardTeacher, FaUsers, FaLightbulb } from 'react-icons/fa';
import './Home.css'; // Fichier CSS pour les styles personnalisés

// Composant animé
const AnimatedCard = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

function Home() {
  const disciplines = [
    {
      name: 'Maths',
      to: '/simulations/maths',
      color: 'linear-gradient(135deg, #f7c6c7 0%, #e8a1a3 100%)',
      icon: <FaCalculator size={30} />,
    },
    {
      name: 'Physique',
      to: '/simulations/physique',
      color: 'linear-gradient(135deg, #cbe8f7 0%, #9ac9e8 100%)',
      icon: <FaAtom size={30} />,
    },
    {
      name: 'Chimie',
      to: '/simulations/chimie',
      color: 'linear-gradient(135deg, #fdf3c3 0%, #f8e68a 100%)',
      icon: <FaFlask size={30} />,
    },
    {
      name: 'Biologie',
      to: '/simulations/biologie',
      color: 'linear-gradient(135deg, #c2f0c2 0%, #8cd98c 100%)',
      icon: <FaDna size={30} />,
    },
    {
      name: 'Science de la Terre',
      to: '/simulations/technologie',
      color: 'linear-gradient(135deg, #e0d4fd 0%, #c1affb 100%)',
      icon: <FaGlobeAmericas size={30} />,
    },
  ];

  const features = [
    {
      title: "Pédagogie Innovante",
      description: "Méthodes interactives pour un apprentissage efficace",
      icon: <FaChalkboardTeacher size={40} />
    },
    {
      title: "Communauté Active",
      description: "Échangez avec des enseignants du monde entier",
      icon: <FaUsers size={40} />
    },
    {
      title: "Ressources Complètes",
      description: "Tout le nécessaire pour vos cours en un seul endroit",
      icon: <FaLightbulb size={40} />
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section avec animation de parallaxe */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            Révolutionnez l'enseignement <br></br><span>avec des simulations interactives</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hero-subtitle"
          >
            Découvrez des expériences scientifiques immersives pour un apprentissage inoubliable
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button 
              as={Link} 
              to="/simulations" 
              variant="primary" 
              size="lg" 
              className="hero-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explorer les simulations
            </Button>
          </motion.div>
        </div>
        
        <div className="hero-scroll-indicator">
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2 
            }}
          >
            <span>Scroll</span>
          </motion.div>
        </div>
      </section>

      {/* Section Disciplines */}
      <section className="disciplines-section">
        <Container>
          <AnimatedCard>
            <h2 className="section-title">Explorez nos disciplines</h2>
            <p className="section-subtitle">Des simulations adaptées à chaque matière scientifique</p>
          </AnimatedCard>
          
          <Row className="g-4 justify-content-center">
            {disciplines.map((disc, idx) => (
              <Col xs={6} sm={4} md={3} lg={2} key={idx}>
                <AnimatedCard delay={idx * 0.1}>
                  <motion.div
                    whileHover={{ 
                      y: -10,
                      boxShadow: "0 15px 30px rgba(0,0,0,0.1)"
                    }}
                    className="discipline-card"
                    style={{ background: disc.color }}
                  >
                    <Link to={disc.to} className="discipline-link">
                      <div className="discipline-icon">{disc.icon}</div>
                      <h3 className="discipline-name">{disc.name}</h3>
                    </Link>
                  </motion.div>
                </AnimatedCard>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Section Features */}
      <section className="features-section">
        <Container>
          <AnimatedCard>
            <h2 className="section-title">Pourquoi choisir SenLab ?</h2>
            <p className="section-subtitle">Une plateforme conçue pour les enseignants et les étudiants</p>
          </AnimatedCard>
          
          <Row className="g-4">
            {features.map((feature, idx) => (
              <Col md={4} key={idx}>
                <AnimatedCard delay={idx * 0.2}>
                  <motion.div 
                    className="feature-card"
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="feature-icon">{feature.icon}</div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </motion.div>
                </AnimatedCard>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <AnimatedCard>
            <motion.div
              whileInView={{ 
                scale: [0.95, 1],
                opacity: [0.9, 1]
              }}
              transition={{ duration: 0.6 }}
              className="cta-card"
            >
              <h2 className="cta-title">Prêt à transformer votre enseignement ?</h2>
              <p className="cta-text">
                Rejoignez notre communauté d'éducateurs innovants et accédez à toutes nos ressources
              </p>
              <div className="cta-buttons">
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary" 
                  size="lg"
                  className="cta-button"
                >
                  S'inscrire maintenant
                </Button>
                <Button 
                  as={Link} 
                  to="/about" 
                  variant="outline-light" 
                  size="lg"
                  className="cta-button"
                >
                  En savoir plus
                </Button>
              </div>
            </motion.div>
          </AnimatedCard>
        </Container>
      </section>
    </div>
  );
}

export default Home;