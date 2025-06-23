import axiosInstance from './axiosInstance';

export const fetchClasses = () => {
  return axiosInstance.get('/api/classes/all');
};

export const createClass = (classeData) => {
  return axiosInstance.post('/api/classes/add', classeData);
};

export const deleteClass = (id) => {
  return axiosInstance.delete(`/api/classes/delete/${id}`);
};

// Tu peux aussi ajouter updateClass si nécessaire
// export const updateClass = (id, updatedData) => {
//   return axiosInstance.put(`/classes/update/${id}`, updatedData);
// };
