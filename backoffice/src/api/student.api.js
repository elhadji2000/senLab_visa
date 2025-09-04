import axiosInstance from './axiosInstance';

//Ajouter un élève
export const addEleve = (eleveData) => {
  return axiosInstance.post('/api/eleves/add', eleveData);
};
// Importer des élèves depuis Excel
export const importElevesFromExcel = (formData) => {
  return axiosInstance.post('/api/eleves/import-excel', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const fetchDashboard = () => {
  return axiosInstance.get('/api/eleves/dashboard');
};
export const fetchDashboardResultats = () => {
  return axiosInstance.get('/api/resultats/dashboard');
};
// Ajouter plusieurs élèves à la fois
export const addMultipleEleves = (eleves) => {
  return axiosInstance.post('/api/eleves/add-multiple', eleves);
};

//Lister tous les élèves (visible selon le rôle)
export const fetchEleves = () => {
  return axiosInstance.get('/api/eleves/all');
};

//Récupérer les élèves d'une classe spécifique
export const fetchElevesByClasse = (classeId) => {
  return axiosInstance.get(`/api/eleves/classe/${classeId}`);
};

//Compter les élèves par classe
export const countElevesParClasse = () => {
  return axiosInstance.get('/api/eleves/count-by-classe');
};

//Mettre à jour un élève
export const updateEleve = (eleveId, updatedData) => {
  return axiosInstance.put(`/api/eleves/update/${eleveId}`, updatedData);
};

//Supprimer un élève
export const deleteEleve = (eleveId) => {
  return axiosInstance.delete(`/api/eleves/delete/${eleveId}`);
};
