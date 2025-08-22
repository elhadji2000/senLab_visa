import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizzById } from "services/quizzService";

// MUI
import {
  Container,
  Typography,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  CircularProgress,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { FaTrophy, FaRedo, FaHome, FaCheck, FaTimes } from "react-icons/fa";

const QuizzRepondre = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchQuizz = async () => {
      try {
        const res = await getQuizzById(id);
        setQuiz(res.quiz);
        setQuestions(res.questions);
      } catch (err) {
        setError("❌ Erreur lors du chargement du quiz.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizz();
  }, [id]);

  const handleChange = (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q) => {
      const correctOption = q.options.find((opt) => opt.is_correct);
      if (answers[q._id] === correctOption._id) correct += 1;
    });

    setScore(Math.round((correct / questions.length) * 100));
    setSubmitted(true);
    setShowModal(true);
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setShowModal(false);
  };

  const handleReturn = () => {
    navigate("/quizz/public");
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error" sx={{ textAlign: "center" }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      {/* En-tête du quiz */}
      <Card sx={{ mb: 4, boxShadow: 4, borderRadius: 3 }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
            {quiz.titre}
          </Typography>
          <Typography color="text.secondary">🎯 Niveau : {quiz.niveau}</Typography>
          <Typography color="text.secondary">📝 {questions.length} questions</Typography>

          {!submitted && (
            <Box sx={{ mt: 3 }}>
              <LinearProgress
                variant="determinate"
                value={(Object.keys(answers).length / questions.length) * 100}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {Object.keys(answers).length}/{questions.length}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Questions */}
      {questions.map((q, idx) => {
        const selected = answers[q._id];
        const correctOption = q.options.find((opt) => opt.is_correct);

        return (
          <Card key={q._id} sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {idx + 1}. {q.titre}
              </Typography>

              <RadioGroup
                value={selected || ""}
                onChange={(e) => handleChange(q._id, e.target.value)}
              >
                {q.options.map((opt) => {
                  const isCorrect = opt._id === correctOption._id;
                  const isSelected = selected === opt._id;

                  let bg = "";
                  if (submitted) {
                    if (isCorrect) bg = "#d4edda"; // vert clair
                    else if (isSelected) bg = "#f8d7da"; // rouge clair
                  }

                  return (
                    <Box
                      key={opt._id}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        mb: 1,
                        bgcolor: bg,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FormControlLabel
                        value={opt._id}
                        control={<Radio disabled={submitted} />}
                        label={opt.option}
                        sx={{ flexGrow: 1 }}
                      />
                      {submitted && (
                        <Box>
                          {isCorrect && <FaCheck color="green" />}
                          {isSelected && !isCorrect && <FaTimes color="red" />}
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>
        );
      })}

      {!submitted && (
        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            size="large"
            disabled={Object.keys(answers).length !== questions.length}
            onClick={handleSubmit}
          >
            ✅ Valider mes réponses
          </Button>
        </Box>
      )}

      {/* Résultats (Dialog) */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle textAlign="center">
          <FaTrophy color="#fbc02d" size={32} />
          <Typography variant="h6">Résultat</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            color={score >= 80 ? "success.main" : score >= 50 ? "warning.main" : "error.main"}
          >
            {score}%
          </Typography>
          <Typography color="text.secondary">
            {Math.round((questions.length * score) / 100)} bonnes réponses sur {questions.length}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            {score >= 80
              ? "🌟 Excellent travail !"
              : score >= 50
              ? "👍 Bon effort !"
              : "💪 Continue à t'entraîner !"}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button variant="outlined" onClick={handleRetry} startIcon={<FaRedo />}>
            Recommencer
          </Button>
          <Button variant="contained" onClick={handleReturn} startIcon={<FaHome />}>
            Retour
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuizzRepondre;
