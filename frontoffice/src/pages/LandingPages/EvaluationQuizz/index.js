/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Container from "@mui/material/Container";
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
  const [step, setStep] = useState("form"); // form | quiz | result | expired | notReady
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState("");

  // 🔹 Vérification du quiz dès l'ouverture du lien
  useEffect(() => {
    let interval;

    const checkQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quizzes/access/${code}`);
        setQuizData(res.data);
        setStep("form");
      } catch (err) {
        const data = err.response?.data;
        const msg = data?.message || "Erreur d’accès au quiz.";

        if (data?.status === "notReady") {
          setStep("notReady");

          interval = setInterval(() => {
            const now = new Date();
            const startDate = new Date(data?.startDate || data?.quiz?.date_debut);
            const remainingMs = startDate - now;

            if (remainingMs <= 0) {
              clearInterval(interval);
              setStep("form"); // quiz dispo
            } else {
              const hours = Math.floor(remainingMs / (1000 * 60 * 60));
              const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

              setCountdown(`${hours}h ${minutes}m ${seconds}s`);
            }
          }, 1000);
        } else if (data?.status === "expired") {
          setStep("expired");
        } else {
          setMessage(msg);
        }
      }
    };

    checkQuiz();

    return () => clearInterval(interval); // cleanup
  }, [code]);

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleEmailSubmit = async () => {
    setMessage("");
    if (!isValidEmail(email)) {
      setMessage("⚠️ Veuillez entrer un email valide.");
      return;
    }

    setLoading(true);
    try {
      // Vérifier que l'élève est bien dans la classe
      await axios.post(`http://localhost:5000/api/quizzes/access/${code}/check-email`, { email });
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
      const res = await axios.post(`http://localhost:5000/api/quizzes/submit/${code}`, {
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
      <MKBox display="flex" flexDirection="column" minHeight="100vh">
        <MKBox position="fixed" top="0.5rem" width="100%">
          <DefaultNavbar routes={routes} />
        </MKBox>

        <MKBox className="container">
          {/* Quiz expiré */}
          {step === "expired" && (
            <Container>
              <MKBox
                px={2}
                mt={20}
                className="text-center p-3 mb-3"
                sx={{
                  backgroundColor: "#fddede", // rouge clair
                  color: "#b00020", // rouge foncé pour texte
                  border: "1px solid #f5c6cb",
                  borderRadius: "8px",
                  fontWeight: "500",
                }}
              >
                ❌ Ce quiz est expiré. Merci de contacter votre enseignant.
              </MKBox>
            </Container>
          )}

          {/* Quiz pas encore disponible */}
          {step === "notReady" && (
            <Container>
              <Alert
                className="text-center"
                style={{
                  backgroundColor: "#fff3cd", // jaune clair
                  color: "#856404", // texte brun/orangé
                  border: "1px solid #ffeeba",
                  borderRadius: "8px",
                  fontWeight: "500",
                  marginTop: "10px",
                }}
              >
                ⏳ Ce quiz n’est pas encore disponible. Temps restant : <span>{countdown}</span>
              </Alert>
            </Container>
          )}

          {/* Formulaire email */}
          {step === "form" && quizData && (
            <>
              <EvaluationQuizzCodeEmail
                email={email}
                setEmail={setEmail}
                onSubmit={handleEmailSubmit}
                loading={loading}
              />
              {message && (
                <MKBox mt={2} className="container">
                  <Alert
                    variant="danger"
                    className="p-2 mb-2 text-center"
                    style={{
                      backgroundColor: "#f8d7da",
                      color: "#721c24",
                      border: "1px solid #f5c6cb",
                    }}
                  >
                    {message}
                  </Alert>
                </MKBox>
              )}
            </>
          )}

          {/* Quiz actif */}
          {step === "quiz" && quizData && (
            <>
              <p className="text-center">
                Quiz pour la classe : <strong>{quizData.classeNom}</strong>
              </p>
              <EvaluationQuizzRepondre
                quizData={quizData}
                answers={answers}
                handleChange={handleChange}
                handleQuizSubmit={handleQuizSubmit}
              />
            </>
          )}

          {/* Résultat */}
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

        <MKBox mt="auto">
          <DefaultFooter content={footerRoutes} />
        </MKBox>
      </MKBox>
    </>
  );
};

export default EvaluationQuizzCode;
