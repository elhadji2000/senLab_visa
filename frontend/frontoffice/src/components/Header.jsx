import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Si vous utilisez React Router

function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [scrolled]);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <nav
            className={`navbar navbar-expand-lg fixed-top ${scrolled ? "scrolled" : ""
                }`}
        >
            <div className="container">
                {/* Logo à gauche */}
                <Link className="navbar-brand" to="/" onClick={closeMobileMenu}>
                    <img
                        src="/src/assets/logo.png" // Remplacez par le chemin de votre logo
                        alt="Logo"
                        className="img-fluid"
                        height="40"
                    />
                </Link>

                {/* Bouton toggle pour mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Contenu de la navbar */}
                <div
                    className={`collapse navbar-collapse ${mobileMenuOpen ? "show" : ""}`}
                >
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
                        <li className="nav-item">
                            <Link className="nav-link" to="/home" onClick={closeMobileMenu}>
                                Accueil
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/about"
                                onClick={closeMobileMenu}
                            >
                                À propos
                            </Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="navbarDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded={mobileMenuOpen ? "true" : "false"}
                            >
                                Simulations
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li>
                                    <Link
                                        className="dropdown-item"
                                        to="/products"
                                        onClick={closeMobileMenu}
                                    >
                                        Toutes les simulations
                                    </Link>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <Link
                                        className="dropdown-item"
                                        to="/product1"
                                        onClick={closeMobileMenu}
                                    >
                                        Physique
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="dropdown-item"
                                        to="/product2"
                                        onClick={closeMobileMenu}
                                    >
                                        Chimie
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="dropdown-item"
                                        to="/product2"
                                        onClick={closeMobileMenu}
                                    >
                                        Maths
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="dropdown-item"
                                        to="/product2"
                                        onClick={closeMobileMenu}
                                    >
                                        Biologie
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="dropdown-item"
                                        to="/product2"
                                        onClick={closeMobileMenu}
                                    >
                                        Science de la Terre
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about" onClick={closeMobileMenu}>
                                Enseignements
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/contact"
                                onClick={closeMobileMenu}
                            >
                                Contact
                            </Link>
                        </li>
                        <li className="nav-item ms-lg-2">
                            <Link
                                className="btn btn-nav btn-outline-primary"
                                to="/login"
                                onClick={closeMobileMenu}
                            >
                                <i className="fas fa-sign-in-alt me-1"></i> Connexion
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="btn btn-nav btn-success"
                                to="/register"
                                onClick={closeMobileMenu}
                            >
                                <i className="fas fa-user-plus me-1"></i> Inscription
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;
