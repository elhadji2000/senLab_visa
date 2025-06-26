import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizzById } from '../services/quizzService';
import { Spinner, Alert, Button, Form, Modal } from 'react-bootstrap';

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

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{quiz.titre}</h2>
      <p><strong>Niveau :</strong> {quiz.niveau}</p>

      <Form>
        {questions.map((question, index) => {
          const selectedId = answers[question._id];
          const correctOption = question.options.find(o => o.is_correct);

          return (
            <div key={question._id} className="mb-4">
              <h5>Q{index + 1}. {question.titre}</h5>
              {question.options.map(option => {
                const isSelected = selectedId === option._id;
                const isCorrect = option._id === correctOption._id;

                let variant = '';
                if (submitted) {
                  if (isCorrect) variant = 'success';
                  else if (isSelected && !isCorrect) variant = 'danger';
                }

                return (
                  <Form.Check
                    key={option._id}
                    type="radio"
                    name={`question-${question._id}`}
                    id={`option-${option._id}`}
                    label={option.option}
                    checked={isSelected}
                    disabled={submitted}
                    onChange={() => handleChange(question._id, option._id)}
                    className={submitted ? `border border-${variant} rounded p-2` : ''}
                  />
                );
              })}
            </div>
          );
        })}

        {!submitted && (
          <Button variant="success" onClick={handleSubmit}>
            Soumettre le quiz
          </Button>
        )}
      </Form>

      {/* ✅ Modal score + options */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Résultat du quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h4>✅ Votre score : {score}/100</h4>
          <p>Bravo pour votre participation !</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRetry}>
            🔁 Réessayer
          </Button>
          <Button variant="primary" onClick={handleReturn}>
            🏠 Retour aux quiz publics
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuizzRepondre;
