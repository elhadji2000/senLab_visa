import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavbarLab = ({ isConnected, user }) => {
    return (
        <Navbar bg="light" expand="lg" fixed="top" className="shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
                    🌟 SenLab
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Accueil</Nav.Link>

                        <NavDropdown title="Simulations">
                            <NavDropdown.Item as={Link} to="/simulations">Toutes les simulations</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/matieres/mathematiques">Mathématiques</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/matieres/physique">Physique</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/matieres/chimie">Chimie</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/matieres/biologie">Biologie</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/matieres">
                                Explorer
                            </NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link as={Link} to="/apropos">À propos</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact</Nav.Link>

                        <NavDropdown title="Quiz">
                            <NavDropdown.Item as={Link} to="/quizz/public">Quiz publics</NavDropdown.Item>
                            {isConnected && (
                                <>
                                    <NavDropdown.Item as={Link} to="/quizz/code">Accès par code</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/quizz/resultats">Mes résultats</NavDropdown.Item>
                                </>
                            )}
                        </NavDropdown>
                    </Nav>

                    {!isConnected ? (
                        <Button as={Link} to="/connexion" variant="outline-primary">
                            Se connecter
                        </Button>
                    ) : (
                        <Nav>
                            <NavDropdown title={user?.prenom || 'Mon compte'}>
                                <NavDropdown.Item as={Link} to="/profil">Profil</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => {
                                    localStorage.removeItem("token");
                                    window.location.reload();
                                }}>Se déconnecter</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarLab;
