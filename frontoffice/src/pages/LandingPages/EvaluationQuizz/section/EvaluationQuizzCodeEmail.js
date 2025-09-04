/* eslint-disable react/prop-types */
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

function EvaluationQuizzCodeEmail({ email, setEmail, onSubmit, loading }) {
  return (
    <MKBox component="section" pt={6} my={6}>
      <Container>
        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={12} md={8}>
            <MKTypography variant="h4" gutterBottom>
              🎓 Accéder à votre quiz
            </MKTypography>
            <MKTypography variant="body2" color="text" mb={3}>
              Entrez votre adresse email pour commencer.
            </MKTypography>
            <Grid container spacing={1}>
              <Grid item xs={8}>
                <MKInput
                  type="email"
                  label="Votre email..."
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <MKButton
                  variant="gradient"
                  color="info"
                  sx={{ height: "100%" }}
                  onClick={onSubmit}
                  disabled={loading}
                >
                  {loading ? "Chargement..." : "Commencer"}
                </MKButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default EvaluationQuizzCodeEmail;
