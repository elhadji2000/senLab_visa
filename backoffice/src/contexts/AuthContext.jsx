// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔐 Récupérer le token depuis le bon stockage
  const getToken = () =>
    localStorage.getItem('token') || sessionStorage.getItem('token');

  // 🔄 Récupérer l'utilisateur avec le token courant
  const fetchUser = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:5000/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (error) {
      console.error('Erreur de vérification du token', error);
      logout();
    }
  };

  // 📦 Connexion
  const login = (token, userData, remember = false) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('token', token);
    setUser(userData);
  };

  // 🚪 Déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(null);
  };

  // 🕵️ Chargement au démarrage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if (token) await fetchUser();
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  // 💡 Facilité d'utilisation
  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        getToken,
        isAuthenticated,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
