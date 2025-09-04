import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

// Images
import macbook from "assets/images/macbook.png";

function Newsletter() {
  return (
    <MKBox component="section" pt={6} my={6}>
      <Container>
        <Grid container alignItems="center">
          <Grid item xs={12} md={6} sx={{ ml: { xs: 0, lg: 3 }, mb: { xs: 12, md: 0 } }}>
            <MKTypography variant="h4">Restez informé</MKTypography>
            <MKTypography variant="body2" color="text" mb={3}>
              Recevez nos dernières actualités et mises à jour directement par e-mail.
            </MKTypography>
            <Grid container spacing={1}>
              <Grid item xs={8}>
                <MKInput type="email" label="Votre email..." fullWidth />
              </Grid>
              <Grid item xs={4}>
                <MKButton variant="gradient" color="info" sx={{ height: "100%" }}>
                  S’inscrire
                </MKButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={5} sx={{ ml: "auto" }}>
            <MKBox position="relative">
              <MKBox component="img" src={macbook} alt="macbook" width="100%" />
            </MKBox>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Newsletter;
