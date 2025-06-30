import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Button,
  Card,
  CardContent,
  Box,
  Checkbox,
  CircularProgress,
  Alert
} from '@mui/material';
import { FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { addQuiz, updateQuiz, fetchQuizDetail } from '../../api/quizAPI';

const niveaux = ['6e', '5e', '4e', '3e', '2nde', '1ère', 'Terminale'];

function AddEditQuizz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    niveau: '',
    isPublic: true,
    questions: [{
      titre: '',
      options: [{ option: '', is_correct: false, note: 0 }],
    }],
  });

  // Chargement des données si mode édition
  useEffect(() => {
    if (id) {
      const fetchQuizData = async () => {
        setLoading(true);
        try {
          const response = await fetchQuizDetail(id);
          const quizData = response.data;

          setFormData({
            titre: quizData.quiz.titre,
            description: quizData.quiz.description,
            niveau: quizData.quiz.niveau,
            isPublic: quizData.quiz.isPublic,
            questions: quizData.questions.map(q => ({
              titre: q.titre,
              options: q.options.map(opt => ({
                option: opt.option,
                is_correct: opt.is_correct,
                note: opt.note || 0
              }))
            }))
          });
        } catch (err) {
          setError("Erreur lors du chargement du quiz");
        } finally {
          setLoading(false);
        }
      };

      fetchQuizData();
    }
  }, [id]);

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { titre: '', options: [{ option: '', is_correct: false, note: 0 }] },
      ],
    });
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...formData.questions];
    newQuestions.splice(index, 1);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index].titre = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[oIndex].option = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleAddOption = (qIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options.push({ option: '', is_correct: false, note: 0 });
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleCorrectChange = (qIndex, oIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.map((opt, idx) => ({
      ...opt,
      is_correct: idx === oIndex,
      note: idx === oIndex ? 1 : 0
    }));
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validation des données
      if (!formData.titre || !formData.niveau) {
        throw new Error('Le titre et le niveau sont obligatoires');
      }

      for (const q of formData.questions) {
        if (!q.titre || q.options.length < 2) {
          throw new Error('Chaque question doit avoir un intitulé et au moins 2 options');
        }

        const correctOptions = q.options.filter(opt => opt.is_correct);
        if (correctOptions.length !== 1) {
          throw new Error('Chaque question doit avoir exactement une bonne réponse');
        }
      }

      const payload = {
        ...formData,
        questions: formData.questions.map(q => ({
          titre: q.titre,
          options: q.options.map(opt => ({
            option: opt.option,
            is_correct: opt.is_correct,
            note: opt.note
          }))
        }))
      };

      if (id) {
        // Mode édition
        await updateQuiz(id, payload);
        setSuccess('Quiz mis à jour avec succès');
        setFormData({
          titre: '',
          description: '',
          niveau: '',
          isPublic: false,
          questions: [{
            titre: '',
            options: [{ option: '', is_correct: false, note: 0 }],
          }],
        });
      } else {
        // Mode création
        await addQuiz(payload);
        setSuccess('Quiz créé avec succès');

        // Réinitialisation du formulaire seulement en mode création
        setFormData({
          titre: '',
          description: '',
          niveau: '',
          isPublic: false,
          questions: [{
            titre: '',
            options: [{ option: '', is_correct: false, note: 0 }],
          }],
        });
      }

      // Redirection après 2 secondes
      setTimeout(() => navigate('/quizz/ajouter'), 2000);
    } catch (error) {
      setError(error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <Button
        startIcon={<FaArrowLeft />}
        onClick={() => navigate('/quizz/lister')}
        className="mb-3"
      >
        Retour
      </Button>

      <Typography variant="h4" gutterBottom className="text-center">
        {id ? 'Modifier le Quiz' : 'Créer un nouveau Quiz'}
      </Typography>

      {error && <Alert severity="error" className="mb-3">{error}</Alert>}
      {success && <Alert severity="success" className="mb-3">{success}</Alert>}

      <Card className="p-4 mb-4 shadow-sm">
        <CardContent>
          <TextField
            fullWidth
            label="Titre du Quiz *"
            margin="normal"
            required
            value={formData.titre}
            onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            margin="normal"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={loading}
          />
          <div className="row">
            <div className="col-md-6">
              <TextField
                select
                fullWidth
                label="Niveau *"
                margin="normal"
                required
                value={formData.niveau}
                onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                disabled={loading}
              >
                {niveaux.map((niveau) => (
                  <MenuItem key={niveau} value={niveau}>
                    {niveau}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="col-md-6 d-flex align-items-center">
              <Checkbox
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                color="primary"
                disabled={loading}
              />
              <Typography>Rendre ce quiz public</Typography>
            </div>
          </div>
        </CardContent>
      </Card>

      {formData.questions.map((question, qIndex) => (
        <Card className="p-3 mb-3 shadow-sm" key={qIndex}>
          <CardContent>
            <Box className="d-flex justify-content-between align-items-center mb-2">
              <Typography variant="h6">Question {qIndex + 1}</Typography>
              <IconButton
                onClick={() => handleRemoveQuestion(qIndex)}
                title="Supprimer la question"
                disabled={loading || formData.questions.length <= 1}
              >
                <FaTrash color={formData.questions.length <= 1 ? "gray" : "red"} />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              label="Intitulé de la question *"
              margin="normal"
              value={question.titre}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              required
              disabled={loading}
            />

            <Typography variant="subtitle1" className="mt-3">
              Options :
            </Typography>

            {question.options.map((option, oIndex) => (
              <Box key={oIndex} className="d-flex align-items-center mb-2">
                <Checkbox
                  checked={option.is_correct}
                  onChange={() => handleCorrectChange(qIndex, oIndex)}
                  color="success"
                  title="Marquer comme bonne réponse"
                  disabled={loading}
                />
                <TextField
                  fullWidth
                  label={`Option ${oIndex + 1}`}
                  value={option.option}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  required
                  disabled={loading}
                />
                <IconButton
                  className="ms-2"
                  onClick={() => handleRemoveOption(qIndex, oIndex)}
                  disabled={loading || question.options.length <= 1}
                  title="Supprimer cette option"
                >
                  <FaTrash color={question.options.length <= 1 ? "gray" : "red"} />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              size="small"
              startIcon={<FaPlus />}
              onClick={() => handleAddOption(qIndex)}
              disabled={loading}
            >
              Ajouter une option
            </Button>
          </CardContent>
        </Card>
      ))}

      <div className="text-end mb-4">
        <Button
          variant="contained"
          onClick={handleAddQuestion}
          startIcon={<FaPlus />}
          disabled={loading}
        >
          Ajouter une question
        </Button>
      </div>

      <div className="text-center mb-5">
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
        >
          {loading ? 'En cours...' : id ? 'Mettre à jour' : 'Enregistrer le Quiz'}
        </Button>
      </div>
    </div>
  );
}

export default AddEditQuizz;