import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizzById } from '../services/quizzService';
import { Spinner, Alert, Button, Form, Modal } from 'react-bootstrap';
import { FaTrophy, FaRedo, FaHome, FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './css/QuizzRepondre.css';

const QuizzRepondre = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchQuizz = async () => {
      try {
        const res = await getQuizzById(id);
        setQuiz(res.quiz);
        setQuestions(res.questions);
      } catch (err) {
        setError('Erreur lors du chargement du quiz.');
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
    let total = questions.length;
    let correct = 0;

    questions.forEach((question) => {
      const selectedOptionId = answers[question._id];
      const correctOption = question.options.find(opt => opt.is_correct);

      if (selectedOptionId && selectedOptionId === correctOption._id) {
        correct += 1;
      }
    });

    const calculatedScore = Math.round((correct / total) * 100);
    setScore(calculatedScore);
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
    navigate('/quizz/public');
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="grow" variant="primary" />
    </div>
  );

  if (error) return (
    <div className="container mt-5">
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="quiz-container py-5"
      style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}
    >
      <div className="container">
        <div className="quiz-header text-center mb-5">
          <motion.h1 
            className="text-primary fw-bold mb-3"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {quiz.titre}
          </motion.h1>
          <div className="badge bg-primary text-white fs-6 p-2 rounded-pill">
            Niveau : {quiz.niveau}
          </div>
        </div>

        <div className="quiz-questions">
          <Form>
            {questions.map((question, index) => {
              const selectedId = answers[question._id];
              const correctOption = question.options.find(o => o.is_correct);

              return (
                <motion.div
                  key={question._id}
                  className="question-card card mb-4 border-0 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="card-body p-4">
                    <h5 className="question-title mb-4">
                      <span className="question-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" style={{ width: '30px', height: '30px' }}>
                        {index + 1}
                      </span>
                      {question.titre}
                    </h5>

                    <div className="options-container">
                      {question.options.map(option => {
                        const isSelected = selectedId === option._id;
                        const isCorrect = option._id === correctOption._id;
                        let optionClass = 'option-item';

                        if (submitted) {
                          if (isCorrect) optionClass += ' correct-option';
                          else if (isSelected && !isCorrect) optionClass += ' wrong-option';
                        }

                        return (
                          <div key={option._id} className={`${optionClass} mb-2`}>
                            <Form.Check
                              type="radio"
                              name={`question-${question._id}`}
                              id={`option-${option._id}`}
                              label={option.option}
                              checked={isSelected}
                              disabled={submitted}
                              onChange={() => handleChange(question._id, option._id)}
                            />
                            {submitted && (
                              <span className="option-icon ms-2">
                                {isCorrect ? (
                                  <FaCheck className="text-success" />
                                ) : isSelected && !isCorrect ? (
                                  <FaTimes className="text-danger" />
                                ) : null}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {!submitted && (
              <motion.div
                className="text-center mt-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== questions.length}
                  className="submit-btn px-5 py-3 rounded-pill fw-bold"
                >
                  Valider mes réponses
                </Button>
              </motion.div>
            )}
          </Form>
        </div>

        {/* Modal de résultats */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="w-100 text-center">
              <FaTrophy className="text-warning mb-2" size={40} />
              <h3 className="mb-0">Résultats du quiz</h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center py-4">
            <div className={`score-circle mx-auto mb-4 ${score >= 80 ? 'bg-success' : score >= 50 ? 'bg-warning' : 'bg-danger'}`}>
              <span className="score-value">{score}</span>
              <span className="score-percent">%</span>
            </div>
            <h5 className="mb-3">
              {score >= 80 ? 'Excellent !' : score >= 50 ? 'Bon travail !' : 'Continue comme ça !'}
            </h5>
            <p className="text-muted">
              Vous avez répondu correctement à {Math.round(questions.length * score / 100)} questions sur {questions.length}
            </p>
          </Modal.Body>
          <Modal.Footer className="border-0 justify-content-center">
            <Button variant="outline-primary" onClick={handleRetry} className="me-3">
              <FaRedo className="me-2" />
              Réessayer
            </Button>
            <Button variant="primary" onClick={handleReturn}>
              <FaHome className="me-2" />
              Retour aux quiz
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <style jsx>{`
        .quiz-container {
          background-color: #f8f9fa;
        }
        .question-card {
          border-radius: 12px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .question-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
        }
        .question-title {
          font-weight: 600;
          color: #2c3e50;
        }
        .question-number {
          font-size: 0.9rem;
        }
        .option-item {
          padding: 12px 15px;
          border-radius: 8px;
          background-color: white;
          border: 1px solid #dee2e6;
          transition: all 0.2s ease;
        }
        .option-item:hover {
          background-color: #f8f9fa;
        }
        .correct-option {
          background-color: rgba(40, 167, 69, 0.1);
          border-left: 4px solid #28a745;
        }
        .wrong-option {
          background-color: rgba(220, 53, 69, 0.1);
          border-left: 4px solid #dc3545;
        }
        .submit-btn {
          background: linear-gradient(135deg, #007bff, #00b4ff);
          border: none;
        }
        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-direction: column;
        }
        .score-value {
          font-size: 2.5rem;
          font-weight: bold;
          line-height: 1;
        }
        .score-percent {
          font-size: 1.2rem;
        }
        .form-check-input:checked {
          background-color: #007bff;
          border-color: #007bff;
        }
      `}</style>
    </motion.div>
  );
};

export default QuizzRepondre;