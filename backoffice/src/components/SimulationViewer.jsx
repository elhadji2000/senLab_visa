import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';

function SimulationViewer() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [iframeSrc, setIframeSrc] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSimulation = async () => {
            try {
                const response = await axiosInstance.get(`/api/simulations/${id}`);
                const simulation = response.data;

                if (!simulation.iframeUrl) {
                    throw new Error("URL de l'iframe introuvable.");
                }

                setIframeSrc(`${axiosInstance.defaults.baseURL}${simulation.iframeUrl}`);
            } catch (err) {
                console.error("Erreur de chargement simulation:", err);
                setError("La simulation est introuvable ou une erreur est survenue.");
            } finally {
                setLoading(false);
            }
        };

        fetchSimulation();
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={50} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" mt={6} px={2}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100vh', width: '100%', overflow: 'hidden', position: 'relative' }}>
            <iframe
                src={iframeSrc}
                title="Simulation interactive"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups"
                allowFullScreen
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                }}
            />
        </Box>
    );
}

export default SimulationViewer;
