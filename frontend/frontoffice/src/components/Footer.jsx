import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-logo">
                        <Link to="/">
                            <img src="/logo1.svg" alt="Logo" width="120" />
                        </Link>
                    </div>

                    <div className="footer-links">
                        <ul>
                            <li><Link to="/about">À propos de SenLab-Visa</Link></li>
                            <li><Link to="/contact">Notre Equipe</Link></li>
                            <li><Link to="/privacy">Partnership</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="footer-social">
                        <a href="#"><i className="fab fa-facebook"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-linkedin"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Universite Alioune DIOP de Bambey. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;