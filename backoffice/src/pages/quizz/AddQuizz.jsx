import React, { useState } from 'react';
import { Typography, TextField, MenuItem, IconButton, Button, Card, CardContent, Box, FormControlLabel, Checkbox } from '@mui/material';
import { FaPlus, FaTrash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const niveaux = ['6e', '5e', '4e', '3e', '2nde', '1ère', 'Terminale'];

function AddQuizz() {
    const [questions, setQuestions] = useState([
        {
            questionText: '',
            options: [{ text: '', isCorrect: false }],
        },
    ]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { questionText: '', options: [{ text: '', isCorrect: false }] }]);
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
            isCorrect: idx === oIndex, // une seule bonne réponse possible
        }));
        setQuestions(newQuestions);
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
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={3}
                        margin="normal"
                    />
                    <TextField
                        select
                        fullWidth
                        label="Niveau *"
                        margin="normal"
                        required
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
                <Button variant="contained" color="success" size="large">
                    Enregistrer le Quizz
                </Button>
            </div>
        </div>
    );
}

export default AddQuizz;
