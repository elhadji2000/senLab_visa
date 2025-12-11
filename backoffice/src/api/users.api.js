import axiosInstance from "./axiosInstance";

// Ajouter un utilisateur
export const addUser = (userData) => {
  return axiosInstance.post("/api/users/add", userData);
};

// Récupérer tous les utilisateurs
export const fetchUsers = () => {
  return axiosInstance.get("/api/users/all");
};
export const fetchStats = () => {
  return axiosInstance.get("/api/users/stats");
};
export const toggleUserStatus = (id, status) => {
  axiosInstance.patch(`/api/users/${id}/status`, { status });
};

// Récupérer un utilisateur par ID
export const fetchUserById = (id) => {
  return axiosInstance.get(`/api/users/${id}`);
};

// Mettre à jour un utilisateur
export const updateUser = (id, updatedData) => {
  return axiosInstance.put(`/api/users/update/${id}`, updatedData);
};
export const updatePassword = (id, updatedData) => {
  return axiosInstance.put(`/api/users/${id}/password`, updatedData);
};
// Supprimer un utilisateur
export const deleteUser = (id) => {
  return axiosInstance.delete(`/api/users/delete/${id}`);
};
