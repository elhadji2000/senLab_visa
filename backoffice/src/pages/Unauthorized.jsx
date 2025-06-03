import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Accès non autorisé
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate(-1)}
        sx={{ mr: 2 }}
      >
        Retour
      </Button>
      <Button 
        variant="outlined" 
        onClick={() => navigate('/dashboard')}
      >
        Tableau de bord
      </Button>
    </Box>
  );
};

export default Unauthorized;