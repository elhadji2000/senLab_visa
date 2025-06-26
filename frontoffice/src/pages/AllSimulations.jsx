import React, { useEffect, useState } from 'react';
import { getAllSimulations } from '../services/simulationService';

const AllSimulations = () => {
  const [simulations, setSimulations] = useState([]);

  useEffect(() => {
    getAllSimulations()
      .then(data => setSimulations(data))
      .catch(error => console.error("Erreur chargement simulations :", error));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Toutes les simulations</h2>
      <div className="row">
        {simulations.map(sim => (
          <div className="col-md-4" key={sim._id}>
            <div className="card mb-3 shadow-sm">
              <img src={`http://localhost:5000${sim.photo}`} className="card-img-top" alt={sim.titre} />
              <div className="card-body">
                <h5 className="card-title">{sim.titre}</h5>
                <p className="card-text">{sim.description}</p>
                <a href={`/simulations/${sim._id}`} className="btn btn-primary">
                  Voir plus
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllSimulations;
