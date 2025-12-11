/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
import routes from "routes";
import footerRoutes from "footer.routes";

import EvaluationQuizzCodeEmail from "./section/EvaluationQuizzCodeEmail";
import EvaluationQuizzRepondre from "./section/EvaluationQuizzRepondre";

// Icônes Material UI
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MKButton from "components/MKButton";

const EvaluationQuizzCode = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [step, setStep] = useState("form"); // form | quiz | result | expired | notReady
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState("");

  //  Vérification du quiz dès l'ouverture du lien
  useEffect(() => {
    let interval;

    const checkQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quizzes/access/${code}`);
        setQuizData(res.data);
        setStep("form");
      } catch (err) {
        const data = err.response?.data;
        const msg = data?.message || "Erreur d'accès au quiz.";

        if (data?.status === "notReady") {
          setStep("notReady");

          interval = setInterval(() => {
            const now = new Date();
            const startDate = new Date(data?.startDate || data?.quiz?.date_debut);
            const remainingMs = startDate - now;

            if (remainingMs <= 0) {
              clearInterval(interval);
              setStep("form");

              //  Rafraîchir automatiquement la page
              setTimeout(() => {
                window.location.reload();
              }, 500); // petit délai pour éviter un conflit avec React
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

    return () => clearInterval(interval);
  }, [code]);

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleEmailSubmit = async () => {
    setMessage("");
    if (!isValidEmail(email)) {
      setMessage("Veuillez entrer un email valide.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/quizzes/access/${code}/check-email`, { email });
      setStep("quiz");
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur d'accès au quiz.");
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
      setMessage("Erreur lors de la soumission.");
    }
  };

  // Composant d'alerte centrée
  const CenteredAlert = ({ icon: Icon, message, bgcolor, color, iconColor }) => (
    <Container maxWidth="md">
      <MKBox display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <MKBox
          sx={{
            backgroundColor: bgcolor,
            color: color,
            borderRadius: "12px",
            padding: "24px 32px",
            textAlign: "center",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <Icon sx={{ fontSize: 60, color: iconColor, mb: 2 }} />
          <MKTypography variant="h5" fontWeight="medium" gutterBottom>
            {message}
          </MKTypography>
          {step === "notReady" && (
            <MKTypography variant="h4" fontWeight="bold" mt={2}>
              {countdown}
            </MKTypography>
          )}
        </MKBox>
      </MKBox>
    </Container>
  );

  return (
    <>
      <MKBox display="flex" flexDirection="column" minHeight="100vh">
        <MKBox position="fixed" top="0.5rem" width="100%">
          <DefaultNavbar routes={routes} />
        </MKBox>

        <MKBox mt={12} mb={6} className="container">
          {/* Message d'erreur général */}
          {message && (
            <Container maxWidth="md">
              <MKBox
                sx={{
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "24px",
                  borderLeft: "4px solid #ef4444",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <ErrorIcon sx={{ color: "#dc2626" }} />
                <MKTypography variant="body2" fontWeight="medium">
                  {message}
                </MKTypography>
              </MKBox>
            </Container>
          )}

          {/* Quiz expiré */}
          {step === "expired" && (
            <CenteredAlert
              icon={ErrorIcon}
              message="Ce quiz est expiré. Merci de contacter votre enseignant."
              bgcolor="#fef2f2"
              color="#dc2626"
              iconColor="#dc2626"
            />
          )}

          {/* Quiz pas encore disponible */}
          {step === "notReady" && (
            <CenteredAlert
              icon={AccessTimeIcon}
              message="Ce quiz n'est pas encore disponible. Temps restant :"
              bgcolor="#fffbeb"
              color="#92400e"
              iconColor="#f59e0b"
            />
          )}

          {/* Formulaire email */}
          {step === "form" && quizData && (
            <EvaluationQuizzCodeEmail
              email={email}
              setEmail={setEmail}
              onSubmit={handleEmailSubmit}
              loading={loading}
              quizData={quizData}
            />
          )}

          {/* Quiz actif */}
          {step === "quiz" && quizData && (
            <EvaluationQuizzRepondre
              quizData={quizData}
              answers={answers}
              handleChange={handleChange}
              handleQuizSubmit={handleQuizSubmit}
            />
          )}

          {/* Résultat */}
          {step === "result" && score !== null && (
            <Container maxWidth="md">
              <MKBox
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
                textAlign="center"
              >
                <MKBox
                  sx={{
                    backgroundColor: "#f0f9ff",
                    borderRadius: "20px",
                    padding: "40px",
                    maxWidth: "500px",
                    width: "100%",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 80, color: "#10b981", mb: 3 }} />
                  <MKTypography variant="h3" fontWeight="bold" gutterBottom>
                    Quiz terminé !
                  </MKTypography>

                  <MKBox mt={4} mb={4}>
                    <MKTypography variant="h6" color="text" gutterBottom>
                      Votre score
                    </MKTypography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "16px",
                        mt: 2,
                      }}
                    >
                      <EmojiEventsIcon sx={{ fontSize: 40, color: "#f59e0b" }} />
                      <MKTypography variant="h1" fontWeight="bold" color="primary">
                        {score}/100
                      </MKTypography>
                    </Box>
                  </MKBox>

                  <MKButton
                    variant="gradient"
                    color="primary"
                    onClick={() => navigate("/")}
                    sx={{
                      mt: 3,
                      px: 4,
                      py: 1.5,
                      borderRadius: "8px",
                    }}
                  >
                    Retour à l'accueil
                  </MKButton>
                </MKBox>
              </MKBox>
            </Container>
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
