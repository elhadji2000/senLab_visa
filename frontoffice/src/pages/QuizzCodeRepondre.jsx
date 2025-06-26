import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

const QuizzCodeRepondre = () => {
    const { code } = useParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [step, setStep] = useState('form'); // form | quiz | result
    const [quizData, setQuizData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await axios.get(`http://localhost:5000/api/quizzes/access/${code}`);
            setQuizData(res.data);
            setStep('quiz');
        } catch (err) {
            setMessage(err.response?.data?.message || "Une erreur est survenue. Vérifiez votre lien.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (questionId, optionId) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleQuizSubmit = async () => {
        const formattedAnswers = Object.entries(answers).map(([questionId, optionId]) => ({
            questionId,
            optionId
        }));

        try {
            const res = await axios.post('http://localhost:5000/api/quizzes/submit/code', {
                code,
                email,
                answers: formattedAnswers
            });

            setScore(res.data.score);
            setStep('result');


        } catch (err) {
            setMessage(err.response?.data?.message || "Erreur lors de la soumission du quiz.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">🎓 Quiz sécurisé</h2>

            {message && <Alert variant="danger">{message}</Alert>}

            {step === 'form' && (
                <Form onSubmit={handleEmailSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Votre adresse email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="exemple@domaine.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            L’adresse doit correspondre à celle transmise à votre professeur.
                        </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Chargement...' : 'Accéder au quiz'}
                    </Button>
                </Form>
            )}

            {step === 'quiz' && quizData && (
                <>
                    <h4 className="mt-4">{quizData.quiz.titre}</h4>
                    <p><strong>Niveau :</strong> {quizData.quiz.niveau}</p>

                    <Form>
                        {quizData.questions.map((question, index) => (
                            <div key={question._id} className="mb-4">
                                <h5>Q{index + 1}. {question.titre}</h5>
                                {question.options.map(option => (
                                    <Form.Check
                                        key={option._id}
                                        type="radio"
                                        name={`question-${question._id}`}
                                        id={`option-${option._id}`}
                                        label={option.option}
                                        checked={answers[question._id] === option._id}
                                        onChange={() => handleChange(question._id, option._id)}
                                    />
                                ))}
                            </div>
                        ))}

                        <Button variant="success" onClick={handleQuizSubmit}>
                            Soumettre le quiz
                        </Button>
                    </Form>
                </>
            )}

            {step === 'result' && (
                <Alert variant="success" className="mt-4 text-center">
                    <h4>✅ Bravo !</h4>
                    <p>Votre score est de <strong>{score}/100</strong>.</p>
                    <Button variant="primary" onClick={() => navigate('/')}>
                        Retourner à l’accueil
                    </Button>
                    <Button variant="secondary" className="ms-2" onClick={() => navigate('/quizz/public')}>
                        Voir d'autres quiz
                    </Button>

                </Alert>
            )}

        </div>
    );
};

export default QuizzCodeRepondre;
