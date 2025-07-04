import React, { useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { AuthContext } from '../contexts/AuthContext';

const NavbarLab = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Déclaration explicite
  const isConnected = !!user;

  if (!isConnected) return null;
  return (
    <Navbar expand="lg" fixed="top" className="py-2" style={{
      backgroundColor: '#E6F2FF', // Bleu très clair
      fontFamily: "'Poppins', sans-serif",
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    }}>
      <Container fluid="lg">
        {/* Logo + Titre */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={logo}
            alt="SenLab Logo"
            height="40"
            className="me-2"
          />
          <span className="text-primary fw-bold fs-4">SenLab</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav" className="justify-content-between">
          <Nav className="mx-auto gap-lg-3">
            <Nav.Link
              as={Link}
              to="/"
              className="text-dark px-2"
              style={{ fontWeight: 500 }}
            >
              Accueil
            </Nav.Link>

            <NavDropdown
              title="Simulations"
              id="simulations-dropdown"
              className="text-dark px-2"
            >
              <NavDropdown.Item as={Link} to="/simulations/all1">
                Toutes les simulations
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/simulations/ajouter">
                Ajouter
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/simulations/explorer">
                Explorer
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              as={Link}
              to="/utilisateur/lister"
              className="text-dark px-2"
              style={{ fontWeight: 500 }}
            >
              Utilisateurs
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/classe/folder"
              className="text-dark px-2"
              style={{ fontWeight: 500 }}
            >
              Classes
            </Nav.Link>

            <NavDropdown
              title="Quiz"
              id="quiz-dropdown"
              className="text-dark px-2"
            >
              <NavDropdown.Item as={Link} to="/quizz/lister">
                Lister
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/quizz/ajouter">
                Ajouter
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <div className="d-flex align-items-center ms-lg-3 mt-3 mt-lg-0">
            {!isConnected ? (
              <Button
                as={Link}
                to="/connexion"
                variant="primary"
                className="ms-lg-3 fw-semibold px-4 py-2"
                style={{
                  backgroundColor: '#0077B6',
                  border: 'none',
                  borderRadius: '8px'
                }}
              >
                Se connecter
              </Button>
            ) : (
              <Nav>
                <NavDropdown
                  title={<span className="text-dark me-2">{user?.nom || 'Mon compte'}</span>}
                  align="end"
                  className="text-dark px-2"
                >
                  <NavDropdown.Item as={Link} to="/profil">
                    <i className="bi bi-person me-2"></i>Profil
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.reload();
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>Se déconnecter
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}
          </div>
        </Navbar.Collapse>
      </Container>

      <style jsx>{`
                .nav-link, .dropdown-toggle {
                    transition: color 0.2s ease;
                }
                .nav-link:hover, .dropdown-toggle:hover {
                    color: #0077B6 !important;
                }
                .dropdown-item {
                    transition: background-color 0.2s ease;
                }
                .dropdown-item:hover {
                    background-color: #E6F2FF !important;
                    color: #0077B6 !important;
                }
                .btn-primary:hover {
                    background-color: #005D8F !important;
                }
            `}</style>
    </Navbar>
  );
};

export default NavbarLab;