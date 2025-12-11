/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logoLab.jpg";
import { AuthContext } from "../contexts/AuthContext";

const NavbarLab = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) return null;

  const isAdmin = user.role === "admin";
  const isProf = user.role === "professeur";

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className="py-2"
      style={{
        backgroundColor: "#E6F2FF",
        fontFamily: "'Poppins', sans-serif",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
      }}
    >
      <Container fluid="lg">
        {/* Logo + Titre */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img src={logo} alt="SenLab Logo" height="40" className="me-2" />
          <span className="text-primary fw-bold fs-4">SenLab</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav" className="justify-content-between">
          <Nav className="mx-auto gap-lg-3">
            {/* Tous les utilisateurs voient Accueil */}
            <Nav.Link
              as={Link}
              to="/"
              className="text-dark px-2"
              style={{ fontWeight: 500 }}
            >
              Accueil
            </Nav.Link>

            {/* Liens visibles uniquement par ADMIN */}
            {isAdmin && (
              <>
                <Nav.Link
                  as={Link}
                  to="/utilisateur/lister"
                  className="text-dark px-2"
                  style={{ fontWeight: 500 }}
                >
                  Utilisateurs
                </Nav.Link>
              </>
            )}

            {/* Liens visibles uniquement par PROFESSEUR */}
            {isProf && (
              <>
                <NavDropdown
                  title="Simulations"
                  id="simulations-dropdown"
                  className="text-dark px-2"
                >
                  {/* <NavDropdown.Item as={Link} to="/simulations/all1">Toutes les simulations</NavDropdown.Item> */}
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
              </>
            )}
          </Nav>

          {/* Menu Profil + Déconnexion */}
          <div className="d-flex align-items-center ms-lg-3 mt-3 mt-lg-0">
            <Nav>
              <NavDropdown
                title={
                  <div
                    className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: "32px",
                      height: "30px",
                      fontSize: "1rem",
                      color: "white",
                    }}
                  >
                    {user.prenom?.charAt(0) || "U"}
                    {user.nom?.charAt(0) || "S"}
                  </div>
                }
                align="end"
                className="text-dark px-2"
              >
                <NavDropdown.Item as={Link} to="/profile">
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
          </div>
        </Navbar.Collapse>
      </Container>

      <style jsx>{`
        .nav-link,
        .dropdown-toggle {
          transition: color 0.2s ease;
        }
        .nav-link:hover,
        .dropdown-toggle:hover {
          color: #0077b6 !important;
        }
        .dropdown-item {
          transition: background-color 0.2s ease;
        }
        .dropdown-item:hover {
          background-color: #e6f2ff !important;
          color: #0077b6 !important;
        }
        .btn-primary:hover {
          background-color: #005d8f !important;
        }
      `}</style>
    </Navbar>
  );
};

export default NavbarLab;
