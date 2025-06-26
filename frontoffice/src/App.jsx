import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavbarLab from './components/NavbarLab';
import Accueil from './pages/Accueil';
import AllSimulations from './pages/AllSimulations';
import SimulationDetail from './pages/SimulationDetail';
import Matieres from './pages/Matieres';
import SimulationsParMatiere from './pages/SimulationsParMatiere';
import Apropos from './pages/Apropos';
import Contact from './pages/Contact';
import QuizzPublic from './pages/QuizzPublic';
import QuizzRepondre from './pages/QuizzRepondre';
import QuizzCodeRepondre from './pages/QuizzCodeRepondre';
// ... autres imports

function App() {
  return (
    <BrowserRouter>
      <NavbarLab />
      <div style={{ marginTop: '80px' }}>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/simulations" element={<AllSimulations />} />
          <Route path="/simulations/:id" element={<SimulationDetail />} />
          <Route path="/matieres" element={<Matieres />} />
          <Route path="/matieres/:matiereId" element={<SimulationsParMatiere />} />
          <Route path="/apropos" element={<Apropos />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quizz/public" element={<QuizzPublic />} />
          <Route path="/quizz/:id" element={<QuizzRepondre />} />
          <Route path="/quizz/access/:code" element={<QuizzCodeRepondre />} />

          {/* <Route path="/quizz/code" element={<QuizzCode />} />
          <Route path="/quizz/resultats" element={<MesResultats />} /> */}

          <Route path="/connexion" element={<div>Connexion</div>} />
          {/* Ajoute les autres pages ici */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
