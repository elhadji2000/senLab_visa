import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import Assistant from './Assistant';

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      {/* <SecondaryNavbar /> */}
      <main className="flex-grow-1 p-3">
      <Outlet /> {/* Affiche ici les pages internes */}
      <Assistant /> 
      </main>
    </div>
  );
};

export default Layout;
