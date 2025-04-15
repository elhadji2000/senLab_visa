import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="custom-footer mt-5 py-4">
      <div className="container text-center">

        {/* Réseaux sociaux avec lignes */}
        <div className="d-flex align-items-center justify-content-center mb-4">
          <div className="flex-grow-1 border-top mx-2"></div>
          <div className="social-icons d-flex gap-3">
            <a href="#"><i className="fab fa-facebook fa-lg"></i></a>
            <a href="#"><i className="fab fa-twitter fa-lg"></i></a>
            <a href="#"><i className="fab fa-linkedin fa-lg"></i></a>
            <a href="#"><i className="fab fa-instagram fa-lg"></i></a>
          </div>
          <div className="flex-grow-1 border-top mx-2"></div>
        </div>

        {/* Liens affichés verticalement */}
        <ul className="footer-links-list list-unstyled mb-3">
          <li className="my-2"><Link to="/about">À propos</Link></li>
          <li className="my-2"><Link to="/contact">Notre équipe</Link></li>
          <li className="my-2"><Link to="/privacy">Partenariats</Link></li>
          <li className="my-2"><Link to="/contact">Contact</Link></li>
        </ul>

        {/* Copyright */}
        <p className="mt-3 text-muted small">
          &copy; {new Date().getFullYear()} Université Alioune DIOP de Bambey. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
