/* eslint-disable react/prop-types */
import MKBox from "components/MKBox";
import Container from "@mui/material/Container";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import { Card, CardContent, FormControlLabel, Radio, RadioGroup, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import QuizIcon from "@mui/icons-material/Quiz";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "12px",
  marginBottom: theme.spacing(3),
  borderLeft: "4px solid #3b82f6",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  },
}));

// eslint-disable-next-line no-unused-vars
const StyledRadio = styled(Radio)(({ theme }) => ({
  "&.Mui-checked": {
    color: "#3b82f6",
  },
}));

function EvaluationQuizzRepondre({ quizData, answers, handleChange, handleQuizSubmit }) {
  const allQuestionsAnswered = Object.keys(answers).length === quizData.questions.length;

  return (
    <MKBox component="section" pt={1} my={3}>
      <Container maxWidth="md">
        <MKBox
          sx={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <QuizIcon sx={{ fontSize: 40, color: "#3b82f6" }} />
            <Box>
              <MKTypography variant="h4" fontWeight="bold" gutterBottom>
                {quizData.quiz.titre}
              </MKTypography>
              <Box display="flex" gap={3}>
                <MKTypography variant="body1" color="text.secondary">
                  <strong>Classe :</strong> {quizData.classeNom}
                </MKTypography>
                <MKTypography variant="body1" color="text.secondary">
                  <strong>Niveau :</strong> {quizData.quiz.niveau}
                </MKTypography>
              </Box>
            </Box>
          </Box>

          <MKTypography variant="body1" color="text" mb={4}>
            Répondez à toutes les questions. Vous avez répondu à {Object.keys(answers).length}/
            {quizData.questions.length} questions.
          </MKTypography>
        </MKBox>

        {quizData.questions.map((question, index) => (
          <StyledCard key={question._id}>
            <CardContent>
              <MKTypography variant="h6" fontWeight="medium" gutterBottom sx={{ color: "#1f2937" }}>
                Question {index + 1}. {question.titre}
              </MKTypography>
              <RadioGroup
                value={answers[question._id] || ""}
                onChange={(e) => handleChange(question._id, e.target.value)}
                sx={{ mt: 2 }}
              >
                {question.options.map((option) => (
                  <FormControlLabel
                    key={option._id}
                    value={option._id}
                    control={<StyledRadio />}
                    label={
                      <MKTypography variant="body1" color="text">
                        {option.option}
                      </MKTypography>
                    }
                    sx={{
                      mb: 1,
                      padding: "8px 12px",
                      borderRadius: "6px",
                      backgroundColor:
                        answers[question._id] === option._id ? "#eff6ff" : "transparent",
                      transition: "background-color 0.2s",
                    }}
                  />
                ))}
              </RadioGroup>
            </CardContent>
          </StyledCard>
        ))}

        <Box textAlign="center" mt={6}>
          <MKButton
            variant="gradient"
            color={allQuestionsAnswered ? "success" : "primary"}
            onClick={handleQuizSubmit}
            disabled={!allQuestionsAnswered}
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "600",
              boxShadow: allQuestionsAnswered ? "0 4px 15px rgba(34, 197, 94, 0.3)" : "none",
            }}
          >
            {allQuestionsAnswered ? "Soumettre le quiz" : "Répondez à toutes les questions"}
          </MKButton>
          {!allQuestionsAnswered && (
            <MKTypography variant="body2" color="error" mt={2}>
              Vous devez répondre à toutes les questions pour soumettre
            </MKTypography>
          )}
        </Box>
      </Container>
    </MKBox>
  );
}

export default EvaluationQuizzRepondre;
