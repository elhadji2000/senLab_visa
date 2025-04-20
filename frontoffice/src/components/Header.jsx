import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar expand="lg" fixed="top" className={`shadow-sm py-3 ${scrolled ? 'bg-white navbar-scrolled' : 'bg-white'}`}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src="/src/assets/logo-uadb.png" alt="Logo" height="40" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/home" active={location.pathname === "/home"}>Accueil</Nav.Link>
            <Nav.Link as={Link} to="/about" active={location.pathname === "/about"}>À propos</Nav.Link>

            <NavDropdown title="Simulations" id="simulations-dropdown">
              <NavDropdown.Item as={Link} to="/products">Toutes les simulations</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/product1">Physique</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/product2">Chimie</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/product2">Maths</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/product2">Biologie</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/product2">Science de la Terre</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/about">Enseignements</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>

            <Button
              as={Link}
              to="/login"
              variant="outline-success"
              className="ms-lg-2 me-2"
            >
              <i className="fas fa-sign-in-alt me-1"></i> Connexion
            </Button>
            <Button
              as={Link}
              to="/register"
              variant="success"
            >
              <i className="fas fa-user-plus me-1"></i> Inscription
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
