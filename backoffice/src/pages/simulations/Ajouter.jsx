import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  IconButton,
  LinearProgress,
  Snackbar,
  Alert,
  MenuItem,
  Card,
  CardContent
} from '@mui/material';
import {
  AddPhotoAlternate as AddPhotoIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const niveaux = ['6e', '5e', '4e', '3e', '2nde', '1ère', 'Terminale'];
const categories = ['Mathematique', 'Physique', 'Chimie', 'Biologie'];

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const FileUploadCard = styled(Card)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover
  }
}));

function Ajouter() {
  const [formData, setFormData] = useState({
    photo: null,
    titre: '',
    description: '',
    niveau: '',
    categorie: '',
    simulation: null
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, photo: file });
    }
  };

  const handleSimulationChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.zip')) {
      setFormData({ ...formData, simulation: file });
      if (errors.simulation) {
        setErrors({ ...errors, simulation: null });
      }
    } else {
      setErrors({ ...errors, simulation: 'Veuillez sélectionner un fichier ZIP valide' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.titre) newErrors.titre = 'Ce champ est requis';
    if (!formData.description) newErrors.description = 'Ce champ est requis';
    if (!formData.niveau) newErrors.niveau = 'Ce champ est requis';
    if (!formData.categorie) newErrors.categorie = 'Ce champ est requis';
    if (!formData.photo) newErrors.photo = 'Une image est requise';
    if (!formData.simulation) newErrors.simulation = 'Un fichier ZIP est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // Création d'un FormData pour envoyer les fichiers
      const data = new FormData();
      data.append('titre', formData.titre);
      data.append('description', formData.description);
      data.append('niveau', formData.niveau);
      data.append('categorie', formData.categorie);
      if (formData.photo) data.append('photo', formData.photo);
      if (formData.simulation) data.append('simulation', formData.simulation);

      // Envoi des données au backend
      const response = await axios.post('http://localhost:5000/api/simulations/add', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Réponse du serveur:', response.data);
      setSuccess(true);

      // Réinitialisation du formulaire après succès
      setTimeout(() => {
        setFormData({
          photo: null,
          titre: '',
          description: '',
          niveau: '',
          categorie: '',
          simulation: null
        });
        setPreview(null);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Erreur lors de l\'envoi:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = (type) => {
    if (type === 'photo') {
      setFormData({ ...formData, photo: null });
      setPreview(null);
    } else {
      setFormData({ ...formData, simulation: null });
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      bgcolor: 'background.default',
      p: 3
    }}>
      <Paper elevation={3} sx={{
        width: '100%',
        maxWidth: 800,
        p: 4,
        borderRadius: 2
      }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 600,
          color: 'primary.main',
          mb: 4
        }}>
          Ajouter une Simulation
        </Typography>
        
        {loading && <LinearProgress sx={{ mb: 3 }} />}
        
        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            icon={<SuccessIcon fontSize="inherit" />}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Simulation ajoutée avec succès!
          </Alert>
        </Snackbar>

        {error && (
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Section Photo */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
              Photo de la simulation
            </Typography>
            
            {preview ? (
              <Box sx={{ position: 'relative', width: 150 }}>
                <Avatar
                  src={preview}
                  alt="Preview"
                  sx={{ width: 150, height: 150, borderRadius: 2 }}
                  variant="rounded"
                />
                <IconButton
                  onClick={() => handleRemoveFile('photo')}
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    bgcolor: 'error.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'error.dark' }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <FileUploadCard component="label">
                <AddPhotoIcon color="primary" sx={{ fontSize: 50, mb: 1 }} />
                <Typography variant="body2" color="text.secondary" align="center">
                  Cliquez pour télécharger ou glisser-déposer
                </Typography>
                <VisuallyHiddenInput 
                  type="file" 
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </FileUploadCard>
            )}
            {errors.photo && (
              <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                {errors.photo}
              </Typography>
            )}
          </Box>
          
          {/* Champ Titre */}
          <TextField
            fullWidth
            label="Titre de la simulation"
            name="titre"
            value={formData.titre}
            onChange={handleInputChange}
            error={!!errors.titre}
            helperText={errors.titre}
            sx={{ mb: 3 }}
            variant="outlined"
          />
          
          {/* Champ Catégorie */}
          <TextField
            select
            fullWidth
            label="Catégorie"
            name="categorie"
            value={formData.categorie}
            onChange={handleSelectChange}
            error={!!errors.categorie}
            helperText={errors.categorie}
            sx={{ mb: 3 }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
          
          {/* Champ Niveau */}
          <TextField
            select
            fullWidth
            label="Niveau"
            name="niveau"
            value={formData.niveau}
            onChange={handleSelectChange}
            error={!!errors.niveau}
            helperText={errors.niveau}
            sx={{ mb: 3 }}
          >
            {niveaux.map((niv) => (
              <MenuItem key={niv} value={niv}>
                {niv}
              </MenuItem>
            ))}
          </TextField>
          
          {/* Champ Description */}
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={4}
            sx={{ mb: 3 }}
            variant="outlined"
          />
          
          {/* Section Fichier Simulation */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
              Fichier de simulation (ZIP)
            </Typography>
            
            {formData.simulation ? (
              <Card variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachFileIcon color="primary" sx={{ mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>{formData.simulation.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(formData.simulation.size / 1024).toFixed(2)} KB
                    </Typography>
                  </Box>
                  <IconButton onClick={() => handleRemoveFile('simulation')}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Card>
            ) : (
              <FileUploadCard component="label">
                <UploadIcon color="primary" sx={{ fontSize: 50, mb: 1 }} />
                <Typography variant="body2" color="text.secondary" align="center">
                  Cliquez pour télécharger un fichier ZIP
                </Typography>
                <VisuallyHiddenInput 
                  type="file" 
                  accept=".zip"
                  onChange={handleSimulationChange}
                />
              </FileUploadCard>
            )}
            {errors.simulation && (
              <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                {errors.simulation}
              </Typography>
            )}
          </Box>
          
          {/* Bouton de soumission */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<UploadIcon />}
              disabled={loading}
              sx={{ px: 4, py: 1.5 }}
            >
              {loading ? 'Envoi en cours...' : 'Publier la Simulation'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default Ajouter;