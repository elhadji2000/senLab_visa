import React from 'react';
import SidebarMenu from './SidebarMenu';
import Navbar from './Navbar'; // si tu as une barre en haut
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="layout">
      <SidebarMenu />
      <div className="main-content">
        <Navbar />
        <div className="page">
          <Outlet /> {/* Affiche ici les pages internes */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
