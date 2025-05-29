import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaPlus,
  FaList,
  FaSignOutAlt,
  FaAtom,
  FaVial,
  FaThList,
  FaFlask,
  FaCalculator,
  FaMicroscope,
} from 'react-icons/fa';
import { MdQuiz, MdAddCircle, MdListAlt } from 'react-icons/md';
import { Collapse, Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import './SecondaryNavbar.css';

const SecondaryNavbar = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <Navbar expand="lg" className="secondary-navbar" onToggle={setExpanded} expanded={expanded}>
      <Container fluid>
        <Navbar.Toggle aria-controls="secondary-navbar-nav" className="ms-auto" />
        <Navbar.Collapse id="secondary-navbar-nav">
          <Nav className="w-100 justify-content-between">
            {/* Dashboard */}
            <Nav.Link 
              as={Link} 
              to="/dashboard" 
              active={isActive('/dashboard')}
              className={`nav-link-secondary ${isActive('/dashboard') ? 'active' : ''}`}
            >
              <FaHome className="nav-icon" />
              <span className="nav-text">Dashboard</span>
            </Nav.Link>

            {/* Utilisateur */}
            <NavDropdown 
              title={
                <>
                  <FaUser className="nav-icon" />
                  <span className="nav-text">Utilisateur</span>
                </>
              } 
              id="user-dropdown"
              className={`nav-dropdown-secondary ${location.pathname.includes('/utilisateur') ? 'active' : ''}`}
            >
              <NavDropdown.Item 
                as={Link} 
                to="/utilisateur/ajouter" 
                active={isActive('/utilisateur/ajouter')}
              >
                <FaPlus className="me-2" />
                Ajouter
              </NavDropdown.Item>
              <NavDropdown.Item 
                as={Link} 
                to="/utilisateur/lister" 
                active={isActive('/utilisateur/lister')}
              >
                <FaList className="me-2" />
                Lister
              </NavDropdown.Item>
            </NavDropdown>

            {/* Simulations */}
            <NavDropdown 
              title={
                <>
                  <FaFlask className="nav-icon" />
                  <span className="nav-text">Simulations</span>
                </>
              } 
              id="simulations-dropdown"
              className={`nav-dropdown-secondary ${location.pathname.includes('/simulations') ? 'active' : ''}`}
            >
              <NavDropdown.Item 
                as={Link} 
                to="/simulations/ajouter" 
                active={isActive('/simulations/ajouter')}
              >
                <FaPlus className="me-2" />
                Ajouter
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item 
                as={Link} 
                to="/simulations/explorer" 
                active={isActive('/simulations/explorer')}
              >
                <FaAtom className="me-2" />
                Explorer les Simulations
              </NavDropdown.Item>
              
              <NavDropdown.Divider />
              
              <NavDropdown.Item 
                as={Link} 
                to="/simulations/all1" 
                active={isActive('/simulations/toutes')}
              >
                <FaThList className="me-2" />
                Toutes les simulations
              </NavDropdown.Item>
            </NavDropdown>

            {/* Gestion Quizz */}
            <NavDropdown 
              title={
                <>
                  <MdQuiz className="nav-icon" />
                  <span className="nav-text">Gestion Quizz</span>
                </>
              } 
              id="quizz-dropdown"
              className={`nav-dropdown-secondary ${location.pathname.includes('/quizz') ? 'active' : ''}`}
            >
              <NavDropdown.Item 
                as={Link} 
                to="/quizz/ajouter" 
                active={isActive('/quizz/ajouter')}
              >
                <MdAddCircle className="me-2" />
                Créer
              </NavDropdown.Item>
              <NavDropdown.Item 
                as={Link} 
                to="/quizz/lister" 
                active={isActive('/quizz/lister')}
              >
                <MdListAlt className="me-2" />
                Tous les Quizz
              </NavDropdown.Item>
            </NavDropdown>

            {/* Déconnexion */}
            {/* <Nav.Link 
              as={Link} 
              to="/logout" 
              active={isActive('/logout')}
              className={`nav-link-secondary ${isActive('/logout') ? 'active' : ''}`}
            >
              <FaSignOutAlt className="nav-icon" />
              <span className="nav-text">Déconnexion</span>
            </Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default SecondaryNavbar;