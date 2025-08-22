import axios from "axios";

const API_URL = "http://localhost:5000/api/quizzes"; // 🔁 adapte si nécessaire

// 🔹 Obtenir tous les quizz publics
export const getPublicQuizz = async () => {
  const response = await axios.get(`${API_URL}/public`);
  return response.data;
};

// 🔹 Obtenir un quiz complet par ID
export const getQuizzById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// 🔹 Soumettre les réponses à un quiz
export const submitQuizz = async ({ quizId, answers, userId = null }) => {
  const response = await axios.post(`${API_URL}/submit`, {
    quizId,
    answers,
    userId,
  });
  return response.data;
};
