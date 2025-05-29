import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress, Alert, Snackbar } from "@mui/material";

// Thème légèrement modernisé
const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px'
          }
        }
      }
    }
  }
});

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://votre-site.com">
        Labo STEM
      </Link>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation simple côté client
      if (!formData.email || !formData.password) {
        throw new Error("Veuillez remplir tous les champs");
      }

      // Appel à l'API backend
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Stockage du token selon le choix "Se souvenir de moi"
      const storage = formData.remember ? localStorage : sessionStorage;
      storage.setItem("authToken", response.data.token);

      // Redirection vers le dashboard
      navigate("/dashboard");
    } catch (err) {
      // Gestion des erreurs
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "Échec de la connexion. Veuillez réessayer.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Connexion
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <FormControlLabel
              control={
                <Checkbox 
                  name="remember"
                  color="primary" 
                  checked={formData.remember}
                  onChange={handleChange}
                />
              }
              label="Se souvenir de moi"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Se connecter"}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forgot-password" variant="body2"> 
                  Mot de passe oublié ?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Vous n'avez pas de compte ? S'inscrire"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>

      {/* Notification d'erreur */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}