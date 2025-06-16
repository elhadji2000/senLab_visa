import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await logout(); // Appel asynchrone pour nettoyer côté serveur si nécessaire
      navigate('/login');
    };
    
    performLogout();
  }, [logout, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 3 }}>
        Déconnexion en cours...
      </Typography>
    </Box>
  );
};

export default Logout;