// src/pages/Matieres.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const MATIERES = ['Mathematique', 'physique', 'chimie', 'biologie'];

const Matieres = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Choisissez une matière</h2>
      <div className="row">
        {MATIERES.map(matiere => (
          <div className="col-md-3" key={matiere}>
            <Link to={`/matieres/${matiere}`} className="text-decoration-none">
              <div className="card text-center shadow-sm mb-3 p-3">
                <h5 className="text-capitalize">{matiere}</h5>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matieres;
