import axiosInstance from './axiosInstance';

// Ajouter un utilisateur
export const addUser = (userData) => {
  return axiosInstance.post('/api/users/add', userData);
};

// Récupérer tous les utilisateurs
export const fetchUsers = () => {
  return axiosInstance.get('/api/users/all');
};

// Récupérer un utilisateur par ID
export const fetchUserById = (id) => {
  return axiosInstance.get(`/api/users/${id}`);
};

// Mettre à jour un utilisateur
export const updateUser = (id, updatedData) => {
  return axiosInstance.put(`/api/users/update/${id}`, updatedData);
};

// Supprimer un utilisateur
export const deleteUser = (id) => {
  return axiosInstance.delete(`/api/users/delete/${id}`);
};
