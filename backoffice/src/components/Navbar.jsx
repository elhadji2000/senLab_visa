import React from 'react';
import './Navbar.css';

const Navbar = ({ username }) => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src="/src/assets/logo-uadb.png" alt="Logo" className="navbar-logo" />
        <span className="navbar-title">Labo STEM</span>
      </div>
      <div className="navbar-right">
        <span className="navbar-user">Bienvenue, {username}</span>
      </div>
    </div>
  );
};

export default Navbar;
