/* eslint-disable react/prop-types */
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import SchoolIcon from "@mui/icons-material/School";

// eslint-disable-next-line no-unused-vars
function EvaluationQuizzCodeEmail({ email, setEmail, onSubmit, loading, quizData }) {
  return (
    <MKBox component="section" pt={1} my={2}>
      <Container maxWidth="md">
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8}>
            <MKBox
              sx={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "40px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Box textAlign="center" mb={4}>
                <SchoolIcon sx={{ fontSize: 60, color: "#3b82f6", mb: 2 }} />
                <MKTypography variant="h3" fontWeight="bold" gutterBottom>
                  Accéder à votre quiz
                </MKTypography>
                <MKTypography variant="body1" color="text" mt={2}>
                  Entrez votre adresse email pour commencer lévaluation
                </MKTypography>
              </Box>

              <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item xs={12} md={8}>
                  <MKInput
                    type="email"
                    label="Votre adresse email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    error={false}
                    helperText=""
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <MKButton
                    variant="gradient"
                    color="primary"
                    onClick={onSubmit}
                    disabled={loading}
                    fullWidth
                    sx={{
                      height: "56px",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "1rem",
                    }}
                  >
                    {loading ? "Vérification..." : "Commencer"}
                  </MKButton>
                </Grid>
              </Grid>
            </MKBox>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default EvaluationQuizzCodeEmail;
