// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour récupérer le token depuis le bon stockage
  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Vérifie l'authentification dès le chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.user);
        } catch (error) {
          console.error('Erreur de vérification du token', error);
          logout(); // Token invalide ou expiré
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Connexion : sauvegarde du token + utilisateur
  const login = (token, userData, remember) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData)); // Optionnel mais pratique
    setUser(userData);
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};
