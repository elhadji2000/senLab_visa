/* eslint-disable react/prop-types */
import MKBox from "components/MKBox";
import Container from "@mui/material/Container";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import { Card, CardContent, FormControlLabel, Radio, RadioGroup } from "@mui/material";

function EvaluationQuizzRepondre({ quizData, answers, handleChange, handleQuizSubmit }) {
  return (
    <MKBox component="section" pt={6} my={6}>
      <Container>
        <MKTypography variant="h4" gutterBottom>
          {quizData.quiz.titre}
        </MKTypography>
        <MKTypography variant="body2" mb={4}>
          Niveau : {quizData.quiz.niveau}
        </MKTypography>

        {quizData.questions.map((question, index) => (
          <Card key={question._id} sx={{ mb: 3 }}>
            <CardContent>
              <MKTypography variant="h6">
                Q{index + 1}. {question.titre}
              </MKTypography>
              <RadioGroup
                value={answers[question._id] || ""}
                onChange={(e) => handleChange(question._id, e.target.value)}
              >
                {question.options.map((option) => (
                  <FormControlLabel
                    key={option._id}
                    value={option._id}
                    control={<Radio />}
                    label={option.option}
                  />
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}

        <MKButton variant="gradient" color="success" onClick={handleQuizSubmit}>
          Soumettre le quiz
        </MKButton>
      </Container>
    </MKBox>
  );
}

export default EvaluationQuizzRepondre;
