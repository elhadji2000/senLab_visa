/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  addSimulation,
  updateSimulation,
  getSimulationById,
} from "../../api/simulationAPI";
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
} from "@mui/material";
import {
  AddPhotoAlternate as AddPhotoIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  CheckCircle as SuccessIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";

const niveaux = ["6e", "5e", "4e", "3e", "2nde", "1ère", "Terminale"];
const categories = [
  "Mathematique",
  "Physique",
  "Chimie",
  "Biologie",
  "SVT",
  "Science de la terre",
];

const VisuallyHiddenInput = styled("input")({
  display: "none",
});

const FileUploadCard = styled(Card)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  cursor: "pointer",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

function AjouterOuModifier({ mode = "add" }) {
  const { id } = useParams(); // pour édition
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    photo: null,
    titre: "",
    description: "",
    niveau: "",
    categorie: "",
    simulation: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  // 🔹 Charger les données existantes en mode édition
  useEffect(() => {
    if (mode === "edit" && id) {
      const loadSimulation = async () => {
        try {
          const res = await getSimulationById(id);
          const data = res.data;
          setFormData({
            titre: data.titre,
            description: data.description,
            niveau: data.niveau,
            categorie: data.categorie,
            photo: null,
            simulation: null,
          });
          setPreview(data.photoUrl || null);
        } catch (err) {
          setError("Impossible de charger la simulation");
        }
      };
      loadSimulation();
    }
  }, [mode, id]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setFormData({ ...formData, photo: file });
    }
  };

  const handleSimulationChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".zip")) {
      setFormData({ ...formData, simulation: file });
      setErrors({ ...errors, simulation: null });
    } else {
      setErrors({
        ...errors,
        simulation: "Veuillez sélectionner un fichier ZIP valide",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.titre) newErrors.titre = "Ce champ est requis";
    if (!formData.description) newErrors.description = "Ce champ est requis";
    if (!formData.niveau) newErrors.niveau = "Ce champ est requis";
    if (!formData.categorie) newErrors.categorie = "Ce champ est requis";
    if (mode === "add" && !formData.photo)
      newErrors.photo = "Une image est requise";
    if (mode === "add" && !formData.simulation)
      newErrors.simulation = "Un fichier ZIP est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    // ⚡ async ajouté ici
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const formPayload = new FormData();
      formPayload.append("titre", formData.titre);
      formPayload.append("description", formData.description);
      formPayload.append("niveau", formData.niveau);
      formPayload.append("categorie", formData.categorie);
      if (formData.photo) formPayload.append("photo", formData.photo);
      if (formData.simulation)
        formPayload.append("simulation", formData.simulation);

      let response;
      if (mode === "edit" && id) {
        response = await updateSimulation(id, formPayload); // ✅ await valide
      } else {
        response = await addSimulation(formPayload); // ✅ await valide
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/simulations/explorer");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 800, p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {mode === "edit"
            ? "Modifier la Simulation"
            : "Ajouter une Simulation"}
        </Typography>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
        >
          <Alert icon={<SuccessIcon />} severity="success" variant="filled">
            {mode === "edit"
              ? "Simulation modifiée avec succès !"
              : "Simulation ajoutée avec succès !"}
          </Alert>
        </Snackbar>

        {error && (
          <Snackbar
            open={!!error}
            autoHideDuration={4000}
            onClose={() => setError(null)}
          >
            <Alert severity="error" variant="filled">
              {error}
            </Alert>
          </Snackbar>
        )}

        <form onSubmit={handleSubmit}>
          {/* Image */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1">Photo de la simulation</Typography>
            {preview ? (
              <Box sx={{ position: "relative", width: 150 }}>
                <Avatar
                  src={preview}
                  sx={{ width: 150, height: 150, borderRadius: 2 }}
                  variant="rounded"
                />
                <IconButton
                  onClick={() => {
                    setFormData({ ...formData, photo: null });
                    setPreview(null);
                  }}
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    bgcolor: "error.main",
                    color: "white",
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <FileUploadCard component="label">
                <AddPhotoIcon color="primary" sx={{ fontSize: 50, mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Cliquez pour télécharger
                </Typography>
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </FileUploadCard>
            )}
            {errors.photo && (
              <Typography color="error" variant="caption">
                {errors.photo}
              </Typography>
            )}
          </Box>

          {/* Champs texte */}
          <TextField
            fullWidth
            label="Titre"
            name="titre"
            value={formData.titre}
            onChange={handleInputChange}
            error={!!errors.titre}
            helperText={errors.titre}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Catégorie"
            name="categorie"
            select
            value={formData.categorie}
            onChange={handleInputChange}
            error={!!errors.categorie}
            helperText={errors.categorie}
            sx={{ mb: 2 }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Niveau"
            name="niveau"
            select
            value={formData.niveau}
            onChange={handleInputChange}
            error={!!errors.niveau}
            helperText={errors.niveau}
            sx={{ mb: 2 }}
          >
            {niveaux.map((niv) => (
              <MenuItem key={niv} value={niv}>
                {niv}
              </MenuItem>
            ))}
          </TextField>
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
          />

          {/* ZIP */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1">Fichier ZIP</Typography>
            {formData.simulation ? (
              <Card
                variant="outlined"
                sx={{ p: 2, display: "flex", alignItems: "center" }}
              >
                <AttachFileIcon color="primary" sx={{ mr: 1 }} />
                <Typography sx={{ flexGrow: 1 }}>
                  {formData.simulation.name}
                </Typography>
                <IconButton
                  onClick={() => setFormData({ ...formData, simulation: null })}
                >
                  <CloseIcon />
                </IconButton>
              </Card>
            ) : (
              <FileUploadCard component="label">
                <UploadIcon color="primary" sx={{ fontSize: 50, mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Cliquez pour télécharger un ZIP
                </Typography>
                <VisuallyHiddenInput
                  type="file"
                  accept=".zip"
                  onChange={handleSimulationChange}
                />
              </FileUploadCard>
            )}
            {errors.simulation && (
              <Typography color="error" variant="caption">
                {errors.simulation}
              </Typography>
            )}
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<UploadIcon />}
              disabled={loading}
            >
              {mode === "edit" ? "Modifier" : "Publier"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default AjouterOuModifier;
