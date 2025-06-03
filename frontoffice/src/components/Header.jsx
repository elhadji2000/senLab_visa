import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Header.css'; // Créez ce fichier CSS pour les styles personnalisés

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const navItem = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const dropdownItem = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2
      }
    })
  };

  return (
    <Navbar 
      expand="lg" 
      fixed="top" 
      className={`navbar-main ${scrolled ? 'scrolled' : ''}`}
      expanded={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img 
              src="/src/assets/logoLab.jpg" 
              alt="Logo" 
              height="40"
              className="logo-img"
            />
            <span className="ms-2 brand-text">SenLab</span>
          </Navbar.Brand>
        </motion.div>

        <Navbar.Toggle 
          aria-controls="main-navbar" 
          className="custom-toggler"
        >
          <motion.div
            animate={isOpen ? "open" : "closed"}
            variants={{
              open: { rotate: 45 },
              closed: { rotate: 0 }
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </motion.div>
        </Navbar.Toggle>

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-lg-center">
            {[
              { path: "/home", label: "ACCUEIL" },
              { path: "/about", label: "À PROPOS" },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={navItem}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <Nav.Link 
                  as={Link} 
                  to={item.path} 
                  active={location.pathname === item.path}
                  className="nav-link-custom"
                >
                  {item.label}
                  <span className="nav-link-underline"></span>
                </Nav.Link>
              </motion.div>
            ))}

            <motion.div variants={navItem} initial="hidden" animate="visible" custom={2}>
              <NavDropdown 
                title={
                  <span className="nav-link-custom">
                    SIMULATIONS
                    <span className="nav-link-underline"></span>
                  </span>
                } 
                id="simulations-dropdown"
                className="dropdown-custom"
                renderOnMount
              >
                {[
                  { path: "/products", label: "Toutes les simulations" },
                  { path: "/physics", label: "Physique" },
                  { path: "/chemistry", label: "Chimie" },
                  { path: "/maths", label: "Mathématiques" },
                  { path: "/biology", label: "Biologie" },
                  { path: "/earth-science", label: "Science de la Terre" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={dropdownItem}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                  >
                    <NavDropdown.Item 
                      as={Link} 
                      to={item.path}
                      className="dropdown-item-custom"
                    >
                      {item.label}
                    </NavDropdown.Item>
                    {index === 0 && <NavDropdown.Divider className="dropdown-divider-custom" />}
                  </motion.div>
                ))}
              </NavDropdown>
            </motion.div>

            {[
              { path: "/teaching", label: "ENSEIGNEMENTS" },
              { path: "/contact", label: "CONTACT" },
            ].map((item, index) => (
              <motion.div
                key={index + 3}
                variants={navItem}
                initial="hidden"
                animate="visible"
                custom={index + 3}
              >
                <Nav.Link 
                  as={Link} 
                  to={item.path} 
                  active={location.pathname === item.path}
                  className="nav-link-custom"
                >
                  {item.label}
                  <span className="nav-link-underline"></span>
                </Nav.Link>
              </motion.div>
            ))}

            <motion.div
              variants={navItem}
              initial="hidden"
              animate="visible"
              custom={5}
              className="d-flex flex-column flex-lg-row gap-2 mt-3 mt-lg-0"
            >
              <Button
                as={Link}
                to="http://localhost:5173"
                variant="outline-primary"
                className="btn-auth"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-sign-in-alt me-2"></i> CONNEXION
              </Button>
              <Button
                as={Link}
                to="/register"
                variant="primary"
                className="btn-auth"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 5px 15px rgba(0, 123, 255, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-user-plus me-2"></i> INSCRIPTION
              </Button>
            </motion.div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;