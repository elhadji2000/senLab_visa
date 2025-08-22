// src/pages/SimulationsParMatiere.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllSimulations } from '../services/simulationService';

const SimulationsParMatiere = () => {
  const { matiereId } = useParams();
  const [simulations, setSimulations] = useState([]);

  useEffect(() => {
    getAllSimulations().then(data => {
      const filtrées = data.filter(sim => sim.categorie.toLowerCase() === matiereId.toLowerCase());
      setSimulations(filtrées);
    });
  }, [matiereId]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Simulations de {matiereId}</h2>
      <div className="row">
        {simulations.length === 0 ? (
          <p>Aucune simulation trouvée pour cette matière.</p>
        ) : (
          simulations.map(sim => (
            <div className="col-md-4" key={sim._id}>
              <div className="card mb-3 shadow-sm">
                <img src={`http://localhost:5000${sim.photo}`} className="card-img-top" alt={sim.titre} />
                <div className="card-body">
                  <h5 className="card-title">{sim.titre}</h5>
                  <p className="card-text">{sim.description}</p>
                  <a href={`/simulations/${sim._id}`} className="btn btn-primary">Voir plus</a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SimulationsParMatiere;
