// src/pages/SimulationDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSimulationById, getSimulationHtmlUrl } from '../services/simulationService';

const SimulationDetail = () => {
    const { id } = useParams();
    const [simulation, setSimulation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSimulation = async () => {
            try {
                const data = await getSimulationById(id);
                setSimulation(data);
            } catch (error) {
                console.error("Erreur lors du chargement de la simulation :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSimulation();
    }, [id]);

    if (loading) return <div className="text-center mt-5">Chargement...</div>;
    if (!simulation) return <div className="text-danger text-center mt-5">Simulation non trouvée.</div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-3">{simulation.titre}</h2>
            <div className="row">
                <div className="col-md-6">
                    <img
                        src={`http://localhost:5000${simulation.photo}`}
                        alt={simulation.titre}
                        className="img-fluid rounded shadow-sm mb-3"
                    />
                    <p><strong>Matière :</strong> {simulation.categorie}</p>
                    <p><strong>Niveau :</strong> {simulation.niveau}</p>
                    <p><strong>Description :</strong> {simulation.description}</p>
                </div>

                <div className="col-md-6">
                    <div className="ratio ratio-16x9 shadow-sm">
                        <iframe
                            title={simulation.titre}
                            src={`http://localhost:5000${simulation.iframeUrl}`}
                            allowFullScreen
                            style={{ border: "1px solid #ccc", borderRadius: "8px" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimulationDetail;
