import axiosInstance from './axiosInstance';

export const fetchClasses = () => {
  return axiosInstance.get('/api/classes/all');
};

export const createClass = (classeData) => {
  return axiosInstance.post('/api/classes/add', classeData);
};
export const updateClass = (id,classeData) => {
  return axiosInstance.put(`/api/classes/update/${id}`, classeData);
};

export const deleteClass = (id) => {
  return axiosInstance.delete(`/api/classes/delete/${id}`);
};

export const fetchClasseById = (id) => {
  return axiosInstance.get(`/api/classes/${id}`);
};

//Ajouter un code de classe
export const createClassCode = (codeData) => {
  return axiosInstance.post('/api/codes/add', codeData);
};

// Récupérer tous les codes pour une classe spécifique
export const getClassCodes = (classeId) => {
  return axiosInstance.get(`/api/codes/classe/${classeId}`);
};


//Récupérer un code par ID
export const getCodeClasseById = (id) => {
  return axiosInstance.get(`/api/codes/${id}`);
};

//Modifier un code
export const updateCodeClasse = (id, updatedData) => {
  return axiosInstance.put(`/api/codes/update/${id}`, updatedData);
};

//Supprimer un code
export const deleteClassCode = (id) => {
  return axiosInstance.delete(`/api/codes/delete/${id}`);
};
