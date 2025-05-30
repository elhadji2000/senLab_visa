import React, { useState } from 'react';
import axios from 'axios';
import {
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Button,
  Card,
  CardContent,
  Box,
  Checkbox
} from '@mui/material';
import { FaPlus, FaTrash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const niveaux = ['6e', '5e', '4e', '3e', '2nde', '1ère', 'Terminale'];

function AddQuizz() {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [niveau, setNiveau] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: [{ text: '', isCorrect: false }],
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', options: [{ text: '', isCorrect: false }] },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].text = value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ text: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    setQuestions(newQuestions);
  };

  const handleCorrectChange = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.map((opt, idx) => ({
      ...opt,
      isCorrect: idx === oIndex,
    }));
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    try {
        const payload = {
            titre,
            description,
            niveau,
            questions: questions.map(q => ({
                titre: q.questionText,
                options: q.options.map(opt => ({
                    option: opt.text, // ✅ Utilise bien "option" comme tu l'as mentionné
                    is_correct: opt.isCorrect,
                    note: opt.isCorrect ? 1 : 0
                }))
            }))
        };        

      const res = await axios.post('http://localhost:5000/api/quizzes/add', payload);
      alert('Quizz ajouté avec succès');
      console.log(res.data);

      // Réinitialisation
      setTitre('');
      setDescription('');
      setNiveau('');
      setQuestions([{ questionText: '', options: [{ option: '', isCorrect: false }] }]);
    } catch (error) {
      console.error("Erreur lors de l'ajout du quizz :", error);
      alert("Échec de l'ajout");
    }
  };

  return (
    <div className="container mt-4">
      <Typography variant="h4" gutterBottom className="text-center">
        Créer un nouveau Quizz
      </Typography>

      <Card className="p-4 mb-4 shadow-sm">
        <CardContent>
          <TextField
            fullWidth
            label="Titre du Quizz *"
            margin="normal"
            required
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            select
            fullWidth
            label="Niveau *"
            margin="normal"
            required
            value={niveau}
            onChange={(e) => setNiveau(e.target.value)}
          >
            {niveaux.map((niveau) => (
              <MenuItem key={niveau} value={niveau}>
                {niveau}
              </MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      {questions.map((question, qIndex) => (
        <Card className="p-3 mb-3 shadow-sm" key={qIndex}>
          <CardContent>
            <Box className="d-flex justify-content-between align-items-center mb-2">
              <Typography variant="h6">Question {qIndex + 1}</Typography>
              <IconButton onClick={() => handleRemoveQuestion(qIndex)} title="Supprimer la question">
                <FaTrash color="red" />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              label="Intitulé de la question *"
              margin="normal"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              required
            />

            <Typography variant="subtitle1" className="mt-3">
              Options :
            </Typography>

            {question.options.map((option, oIndex) => (
              <Box key={oIndex} className="d-flex align-items-center mb-2">
                <Checkbox
                  checked={option.isCorrect}
                  onChange={() => handleCorrectChange(qIndex, oIndex)}
                  color="success"
                  title="Marquer comme bonne réponse"
                />
                <TextField
                  fullWidth
                  label={`Option ${oIndex + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  required
                />
                <IconButton
                  className="ms-2"
                  onClick={() => handleRemoveOption(qIndex, oIndex)}
                  disabled={question.options.length === 1}
                  title="Supprimer cette option"
                >
                  <FaTrash color="gray" />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              size="small"
              startIcon={<FaPlus />}
              onClick={() => handleAddOption(qIndex)}
            >
              Ajouter une option
            </Button>
          </CardContent>
        </Card>
      ))}

      <div className="text-end mb-4">
        <Button variant="contained" onClick={handleAddQuestion} startIcon={<FaPlus />}>
          Ajouter une question
        </Button>
      </div>

      <div className="text-center mb-5">
        <Button variant="contained" color="success" size="large" onClick={handleSubmit}>
          Enregistrer le Quizz
        </Button>
      </div>
    </div>
  );
}

export default AddQuizz;
