import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizzById } from '../services/quizzService';
import { Spinner, Alert, Button, Form, Modal, Container } from 'react-bootstrap';
import { FaTrophy, FaRedo, FaHome, FaCheck, FaTimes } from 'react-icons/fa';

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
    navigate('/quizz/public');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="m-4 text-center">{error}</Alert>;
  }

  return (
    <Container className="py-4" style={{ backgroundColor: '#f5f5f5' }}>
      <h2 className="text-center text-primary mb-2">{quiz.titre}</h2>
      <p className="text-center text-muted mb-4">Niveau : {quiz.niveau}</p>

      <Form>
        {questions.map((q, idx) => {
          const selected = answers[q._id];
          const correctOption = q.options.find((opt) => opt.is_correct);

          return (
            <div key={q._id} className="mb-3 bg-white p-3 rounded shadow-sm">
              <h5 className="mb-3">
                {idx + 1}. {q.titre}
              </h5>
              {q.options.map((opt) => {
                const isCorrect = opt._id === correctOption._id;
                const isSelected = selected === opt._id;

                let bg = '';
                if (submitted) {
                  if (isCorrect) bg = 'bg-success bg-opacity-25';
                  else if (isSelected) bg = 'bg-danger bg-opacity-25';
                }

                return (
                  <div key={opt._id} className={`p-2 rounded ${bg}`}>
                    <Form.Check
                      type="radio"
                      name={`q-${q._id}`}
                      id={`opt-${opt._id}`}
                      label={opt.option}
                      checked={isSelected}
                      disabled={submitted}
                      onChange={() => handleChange(q._id, opt._id)}
                    />
                    {submitted && (
                      <span className="ms-2">
                        {isCorrect && <FaCheck className="text-success" />}
                        {isSelected && !isCorrect && <FaTimes className="text-danger" />}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {!submitted && (
          <div className="text-center mt-4">
            <Button
              variant="primary"
              disabled={Object.keys(answers).length !== questions.length}
              onClick={handleSubmit}
            >
              Valider mes réponses
            </Button>
          </div>
        )}
      </Form>

      {/* Résultats */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            <FaTrophy className="text-warning mb-2" size={32} />
            <div>Résultat</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h1 className={`fw-bold ${score >= 80 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-danger'}`}>
            {score}%
          </h1>
          <p className="text-muted">
            {Math.round(questions.length * score / 100)} bonnes réponses sur {questions.length}
          </p>
          <p>
            {score >= 80
              ? "Excellent travail !"
              : score >= 50
              ? "Bon effort !"
              : "Continue à t'entraîner !"}
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="outline-secondary" onClick={handleRetry}>
            <FaRedo className="me-2" /> Recommencer
          </Button>
          <Button variant="primary" onClick={handleReturn}>
            <FaHome className="me-2" /> Retour
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default QuizzRepondre;
