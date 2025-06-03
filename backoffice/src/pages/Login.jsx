import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Avatar, Button, CssBaseline, TextField,
  FormControlLabel, Checkbox, Link, Grid,
  Box, Typography, Container, CircularProgress,
  Alert, Snackbar, IconButton, InputAdornment
} from "@mui/material";
import {
  LockOutlined, Visibility, VisibilityOff
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from '../contexts/AuthContext';

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

export default function SignIn() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  // ... autres states ...

  // Vérification que le contexte est disponible
  if (!authContext) {
    return (
      <Alert severity="error">
        Erreur de configuration d'authentification - veuillez recharger la page
      </Alert>
    );
  }

  const { login } = authContext;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    }
  }, [navigate, location]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleBlur = (e) => {
    if (e.target.name === "email" && !validateEmail(formData.email)) {
      setEmailError("Veuillez entrer une adresse email valide");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // Validation
    if (!formData.email || !formData.password) throw new Error("Veuillez remplir tous les champs");
    if (emailError) throw new Error("Veuillez corriger les erreurs dans le formulaire");

    // Connexion
    const { data } = await axios.post("http://localhost:5000/api/auth/login", {
      email: formData.email,
      password: formData.password,
    });

    // Gestion de la connexion via le contexte
    login(data.token, data.user, formData.remember);
    navigate(location.state?.from?.pathname || "/dashboard", { replace: true });

  } catch (err) {
    setError(
      err.response?.data?.message || 
      err.message || 
      "Échec de la connexion. Veuillez réessayer."
    );
    if (err.response?.status === 401) setFormData(prev => ({ ...prev, password: "" }));
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
            <LockOutlined />
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
              onBlur={handleBlur}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
      </Container>

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