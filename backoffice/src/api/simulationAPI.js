import axiosInstance from './axiosInstance';

// ➕ Ajouter une simulation (FormData avec fichier ZIP + image)
export const addSimulation = (simData) => {
  return axiosInstance.post('/api/simulations/add', simData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 📋 Lister toutes les simulations
export const fetchSimulations = () => {
  return axiosInstance.get('/api/simulations');
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

// 🟡 À implémenter côté backend si nécessaire :
export const getSimulationById = (id) => {
  return axiosInstance.get(`/api/simulations/${id}`);
};

export const updateSimulation = (id, updatedData) => {
  return axiosInstance.put(`/api/simulations/update/${id}`, updatedData);
};

export const deleteSimulation = (id) => {
  return axiosInstance.delete(`/api/simulations/delete/${id}`);
};
