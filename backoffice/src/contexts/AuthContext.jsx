// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer le token depuis localStorage ou sessionStorage
  const getToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  // Fonction pour récupérer l'utilisateur via /verify
  const fetchUser = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        return res.data.user;
      } else {
        // Token invalide, on nettoie
        logout();
        return null;
      }
    } catch (error) {
      console.error("Erreur de vérification du token", error);
      logout();
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token, userData = null, remember = false) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("token", token);

    if (userData) {
      setUser(userData);
    } else {
      await fetchUser();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get("token");

      if (urlToken) {
        // Stocker le token et nettoyer l'URL
        localStorage.setItem("token", urlToken);
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Maintenant récupérer les données utilisateur avec le nouveau token
        await fetchUser();
      } else {
        // Pas de token dans l'URL, vérifier le stockage local
        const token = getToken();
        if (token) {
          await fetchUser();
        } else {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();
  }, []);

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