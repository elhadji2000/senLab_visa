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
const categories = ['Mathematique', 'Physique', 'Chimie', 'Biologie'];

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
    categorie: '',
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
            categorie: quizData.quiz.categorie,
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
          categorie: '',
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
          categorie: '',
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

      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        {id ? '✏️ Modifier le Quiz' : '🧪 Créer un Quiz interactif'}
      </Typography>


      {error && <Alert severity="error" className="mb-3">{error}</Alert>}
      {success && <Alert severity="success" className="mb-3">{success}</Alert>}

      <Card className="p-4 mb-4 shadow-sm">
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="🎯 Titre du Quiz *"
              required
              fullWidth
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              disabled={loading}
            />
            <TextField
              label="📝 Description (facultatif)"
              multiline
              rows={3}
              fullWidth
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={loading}
            />
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                select
                label="🎓 Niveau *"
                value={formData.niveau}
                onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                fullWidth
                disabled={loading}
              >
                {niveaux.map((niveau) => (
                  <MenuItem key={niveau} value={niveau}>
                    {niveau}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="🎓 Dicipline *"
                value={formData.categorie}
                onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                fullWidth
                disabled={loading}
              >
                {categories.map((categorie) => (
                  <MenuItem key={categorie} value={categorie}>
                    {categorie}
                  </MenuItem>
                ))}
              </TextField>
              <Box display="flex" alignItems="center">
                <Checkbox
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  disabled={loading}
                />
                <Typography variant="body2">Quiz Public</Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>


      {formData.questions.map((question, qIndex) => (
        <Card className="p-3 mb-3 border shadow-sm" key={qIndex}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" color="primary">❓ Question {qIndex + 1}</Typography>
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
              label="Texte de la question *"
              margin="normal"
              value={question.titre}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              disabled={loading}
            />

            <Typography variant="subtitle2" gutterBottom className="mt-2">Réponses proposées :</Typography>

            {question.options.map((option, oIndex) => (
              <Box key={oIndex} className="d-flex align-items-center mb-2">
                <Checkbox
                  checked={option.is_correct}
                  onChange={() => handleCorrectChange(qIndex, oIndex)}
                  title="Réponse correcte"
                  color="success"
                  disabled={loading}
                />
                <TextField
                  fullWidth
                  label={`Option ${oIndex + 1}`}
                  value={option.option}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  disabled={loading}
                />
                <IconButton
                  onClick={() => handleRemoveOption(qIndex, oIndex)}
                  disabled={loading || question.options.length <= 1}
                  title="Supprimer cette réponse"
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
              Ajouter une réponse
            </Button>
          </CardContent>
        </Card>

      ))}

      <div className="text-center mb-4">
        <Button
          variant="contained"
          onClick={handleAddQuestion}
          startIcon={<FaPlus />}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          Ajouter une nouvelle question
        </Button>
      </div>

      <div className="text-center mb-5">
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <FaPlus />}
        >
          {loading ? 'Traitement...' : id ? '✅ Mettre à jour le Quiz' : '💾 Enregistrer le Quiz'}
        </Button>
      </div>
    </div>
  );
}

export default AddEditQuizz;