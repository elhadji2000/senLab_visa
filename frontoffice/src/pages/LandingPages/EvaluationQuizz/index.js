import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert } from "react-bootstrap";

import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
import routes from "routes";
import footerRoutes from "footer.routes";

import EvaluationQuizzCodeEmail from "./section/EvaluationQuizzCodeEmail";
import EvaluationQuizzRepondre from "./section/EvaluationQuizzRepondre";

const EvaluationQuizzCode = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [step, setStep] = useState("form"); // form | quiz | result
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleEmailSubmit = async () => {
    setMessage("");
    if (!isValidEmail(email)) {
      setMessage("⚠️ Veuillez entrer un email valide.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/quizzes/access/${code}`);
      setQuizData(res.data);
      setStep("quiz");
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur d’accès au quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleQuizSubmit = async () => {
    const formattedAnswers = Object.entries(answers).map(([questionId, optionId]) => ({
      questionId,
      optionId,
    }));

    try {
      const res = await axios.post("http://localhost:5000/api/quizzes/submit/code", {
        code,
        email,
        answers: formattedAnswers,
      });
      setScore(res.data.score);
      setStep("result");
    } catch (err) {
      setMessage("❌ Erreur lors de la soumission.");
    }
  };

  return (
    <>
      {/* Navbar */}
      <MKBox position="fixed" top="0.5rem" width="100%">
        <DefaultNavbar routes={routes} />
      </MKBox>

      {/* Contenu principal - rapproché du navbar */}
      <MKBox pt={5} px={2} mt={3} className="container">
        {step === "form" && (
          <>
            <EvaluationQuizzCodeEmail
              email={email}
              setEmail={setEmail}
              onSubmit={handleEmailSubmit}
              loading={loading}
            />

            {/* Message d’erreur sous le champ email */}
            {message && (
              <MKBox mt={1}>
                <Alert variant="danger" className="p-2 mb-2 text-danger">
                  {message}
                </Alert>
              </MKBox>
            )}
          </>
        )}

        {step === "quiz" && quizData && (
          <EvaluationQuizzRepondre
            quizData={quizData}
            answers={answers}
            handleChange={handleChange}
            handleQuizSubmit={handleQuizSubmit}
          />
        )}

        {step === "result" && (
          <Alert variant="success" className="mt-4 text-center">
            <h4>✅ Bravo !</h4>
            <p>
              Votre score est de <strong>{score}/100</strong>.
            </p>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Retour à l’accueil
            </button>
          </Alert>
        )}
      </MKBox>

      {/* Footer */}
      <MKBox pt={4} px={1} mt={4}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
};

export default EvaluationQuizzCode;
