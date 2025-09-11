import axiosInstance from './axiosInstance';

// ➕ Ajouter une simulation (FormData avec fichier ZIP + image)
export const addSimulation = (simData) => {
  return axiosInstance.post('/api/simulations/add', simData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 📋 Lister toutes les simulations (utilisateur connecté ou tout si admin)
export const fetchSimulations = () => {
  return axiosInstance.get('/api/simulations/byuser');
};

// 📊 Nombre de simulations par catégorie
export const countSimulationsByCategory = () => {
  return axiosInstance.get('/api/simulations/count');
};

// 🌐 Charger le HTML d’une simulation (pour l’iframe)
export const fetchSimulationHTML = (simulationId) => {
  return axiosInstance.get(`/api/simulations/html/${simulationId}`, {
    responseType: 'text' // On attend du HTML brut
  });
};

// 🔎 Obtenir une simulation par ID
export const getSimulationById = (id) => {
  return axiosInstance.get(`/api/simulations/${id}`);
};

// ✏️ Mettre à jour une simulation (FormData avec fichier ZIP + image si besoin)
export const updateSimulation = (id, updatedData) => {
  return axiosInstance.put(`/api/simulations/${id}`, updatedData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 🗑️ Supprimer une simulation
export const deleteSimulation = (id) => {
  return axiosInstance.delete(`/api/simulations/${id}`);
};
