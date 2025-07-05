import axiosInstance from './axiosInstance';

// Ajouter un résultat
export const addResultat = (resultatData) => {
  return axiosInstance.post('/api/resultats/add', resultatData);
};

//Lister tous les résultats (admin)
export const fetchResultats = () => {
  return axiosInstance.get('/api/resultats/all');
};
//Lister les résultats par classe
export const fetchResultatsParClasse = (classeId) => {
  return axiosInstance.get(`/api/resultats/par-classe/${classeId}`);
};


//Compter tous les résultats
export const countResultats = () => {
  return axiosInstance.get('/api/resultats/count');
};

// Obtenir un résultat par ID
export const fetchResultatById = (id) => {
  return axiosInstance.get(`/api/resultats/${id}`);
};

//Obtenir tous les résultats d’un élève
export const fetchResultatsByEleve = (eleveId) => {
  return axiosInstance.get(`/api/resultats/eleve/${eleveId}`);
};

// Obtenir tous les résultats d’un quiz
export const getEvaluationsByClass = (quizId) => {
  return axiosInstance.get(`/api/resultats/quiz/${quizId}`);
};

// Mettre à jour un résultat
export const updateResultat = (id, updatedData) => {
  return axiosInstance.put(`/api/resultats/update/${id}`, updatedData);
};

//Supprimer un résultat
export const deleteResultat = (id) => {
  return axiosInstance.delete(`/api/resultats/delete/${id}`);
};
