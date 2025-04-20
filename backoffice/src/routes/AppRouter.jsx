import React from 'react';
import { Route, Routes } from 'react-router-dom'; 
import Login from '../pages/Login';
import Footer2 from '../components/Footer2';
import Dashboard from '../pages/Dashboard';
import Layout from '../components/Layout';
import AddUsers from '../pages/users/AddUsers';
import ListUsers from '../pages/users/ListUsers';
import ListQuizz from '../pages/quizz/ListQuizz';
import AddQuizz from '../pages/quizz/AddQuizz';
import '../App.css';

function AppRouter() {
  return (
    <div className="page-container">
      <main className="container-fluid">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/log" element={<Login />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/utilisateur/ajouter" element={<AddUsers />} />
            <Route path="/utilisateur/lister" element={<ListUsers />} />
            <Route path="/quizz/lister" element={<ListQuizz />} />
            <Route path="/quizz/ajouter" element={<AddQuizz />} />
            {/* Ajoute d'autres routes ici */}
          </Route>
        </Routes>
      </main>

      <Footer2 />
    </div>
  );
}

export default AppRouter;
