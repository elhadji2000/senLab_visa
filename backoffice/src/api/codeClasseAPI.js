import axiosInstance from './axiosInstance';

// ➕ Ajouter un code de classe
export const addCodeClasse = (codeData) => {
  return axiosInstance.post('/api/codes/add', codeData);
};

// 📋 Lister tous les codes (admin = tout, user = ses codes)
export const fetchCodeClasses = () => {
  return axiosInstance.get('/api/codes/all');
};

// 🔍 Récupérer un code par ID
export const getCodeClasseById = (id) => {
  return axiosInstance.get(`/api/codes/${id}`);
};

// 🔄 Modifier un code
export const updateCodeClasse = (id, updatedData) => {
  return axiosInstance.put(`/api/codes/update/${id}`, updatedData);
};

// ❌ Supprimer un code
export const deleteCodeClasse = (id) => {
  return axiosInstance.delete(`/api/codes/delete/${id}`);
};
