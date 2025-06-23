import axiosInstance from './axiosInstance';

// 📋 Lister tous les quiz (selon le rôle)
export const fetchQuizzes = () => {
  return axiosInstance.get('/api/quizzes/all');
};



// ➕ Ajouter un quiz avec questions et options
export const addQuiz = (quizData) => {
  return axiosInstance.post('/api/quizzes/add', quizData);
};

// 🔍 Obtenir un quiz par ID (avec ses questions et options)
export const fetchQuizDetail = (id) => {
  return axiosInstance.get(`/api/quizzes/${id}`);
};

// ✏️ Mettre à jour un quiz (titre, description, niveau)
export const updateQuiz = (id, updatedData) => {
  return axiosInstance.put(`/api/quizzes/${id}`, updatedData);
};

// ❌ Supprimer un quiz
export const deleteQuiz = (id) => {
  return axiosInstance.delete(`/api/quizzes/${id}`);
};

// 🔢 Compter le nombre total de quiz
export const countQuizzes = () => {
  return axiosInstance.get('/api/quizzes/count');
};
