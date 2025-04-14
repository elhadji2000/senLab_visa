import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import backgroundImage from '../assets/senLab2.jpg'; // adapte selon ton projet
import backgroundImage2 from '../assets/senLab3.jpg';
import { FaCalculator, FaAtom, FaFlask, FaDna, FaGlobeAmericas } from 'react-icons/fa';

function Home() {
  const disciplines = [
    {
      name: 'Maths',
      to: '/simulations/maths',
      color: '#f7c6c7',
      icon: <FaCalculator size={30} className="mt-2" />,
    },
    {
      name: 'Physique',
      to: '/simulations/physique',
      color: '#cbe8f7',
      icon: <FaAtom size={30} className="mt-2" />,
    },
    {
      name: 'Chimie',
      to: '/simulations/chimie',
      color: '#fdf3c3',
      icon: <FaFlask size={30} className="mt-2" />,
    },
    {
      name: 'Biologie',
      to: '/simulations/biologie',
      color: '#c2f0c2',
      icon: <FaDna size={30} className="mt-2" />,
    },
    {
      name: 'Science de la Terre',
      to: '/simulations/technologie',
      color: '#e0d4fd',
      icon: <FaGlobeAmericas size={30} className="mt-2" />,
    },
  ];
  return (
    <>
      <Card className="text-white border-0">
        <Card.Img
          src={backgroundImage}
          alt="Card image"
          style={{
            height: '80vh', // plein écran, responsive
            objectFit: 'cover',
            filter: 'brightness(0.6)',
          }}
        />
        <Card.ImgOverlay
          className="d-flex flex-column justify-content-center align-items-center text-center"
          style={{
            minHeight: '80vh',
          }}
        >
          <div>
            <Card.Title className="display-5 fw-bold">
              Simulations interactives pour les sciences et les maths
            </Card.Title>
            <Card.Text className="mt-3 fs-5">
              Découvrez nos expériences ludiques et éducatives !
            </Card.Text>
            <Link to="/simulations">
              <Button variant="light" className="mt-4 px-4 py-2">
                Explorer les simulations
              </Button>
            </Link>
          </div>
        </Card.ImgOverlay>
        <Card.Footer className="text-muted text-center">© 2025 senLab</Card.Footer>
      </Card>

      {/* Section avec les gros boutons des disciplines */}
      <Container className="text-center my-5">
        <h2 className="mb-4">Explorez les disciplines</h2>
        <Row className="g-4 justify-content-center">
          {disciplines.map((disc, idx) => (
            <Col xs={6} sm={4} md={3} lg={2} key={idx}>
              <Link to={disc.to} style={{ textDecoration: 'none' }}>
                <div
                  className="d-flex flex-column justify-content-center align-items-center rounded-4 shadow"
                  style={{
                    backgroundColor: disc.color,
                    height: '150px',
                    width: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.3s',
                  }}
                >
                  <span className="fs-5 fw-bold text-dark">{disc.name}</span>
                  {disc.icon}
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>

      <Card className="text-white border-0">
        <Card.Img
          src={backgroundImage2}
          alt="Card image"
          style={{
            height: '80vh', // plein écran, responsive
            objectFit: 'cover',
            filter: 'brightness(0.6)',
          }}
        />
        <Card.ImgOverlay
          className="d-flex flex-column justify-content-center align-items-left text-left"
          style={{
            minHeight: '80vh',
          }}
        >
          <div>
            <Card.Title className="display-5 fw-bold">
              Enseigner autrement<br />avec des outils interactifs
            </Card.Title>
            <Card.Text className="mt-3 fs-5">
              Accédez à des conseils pratiques, des vidéos de prise en main<br />
              et des ressources prêtes à l’emploi pour chaque simulation.<br />
              Enseignez plus facilement avec nos outils interactifs.<br />
              Partagez vos idées et découvrez celles d'autres enseignants<br />
              au sein d’une communauté engagée.
            </Card.Text>
            <Link to="/simulations">
              <Button variant="light" className="mt-4 px-4 py-2">
                S'ENREGISTRER MAINTENANT
              </Button>
            </Link>
          </div>
        </Card.ImgOverlay>
      </Card>

    </>
  );
}

export default Home;
