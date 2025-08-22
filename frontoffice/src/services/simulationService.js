import axios from "axios";

const API_URL = "http://localhost:5000/api/simulations"; // Adapte si besoin
const BASE_URL = "http://localhost:5000";

// Récupérer toutes les simulations
export const getAllSimulations = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

// Récupérer une simulation par ID
export const getSimulationById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Récupérer les stats par catégorie
export const getSimulationCountByCategory = async () => {
  const response = await axios.get(`${API_URL}/count`);
  return response.data;
};

// Obtenir le chemin HTML d'une simulation (à afficher dans un iframe)
export const getSimulationHtmlUrl = (simulationId) => {
  // On suppose que l'URL complète pour afficher une simulation est /simulations/:id/html
  return `${BASE_URL}/simulations/${simulationId}/html`;
};
