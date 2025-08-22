import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 React examples

// Images
import appleLogo from "assets/uvs.png";
import facebookLogo from "assets/ucad.png";
import nasaLogo from "assets/logo2.png";
import vodafoneLogo from "assets/uasz.png";
import digitalOceanLogo from "assets/ugb.png";

function Information() {
  return (
    <MKBox component="section" py={12}>
      <Container>
        <Grid
          container
          item
          xs={12}
          lg={6}
          justifyContent="center"
          sx={{ mx: "auto", textAlign: "center" }}
        >
          <MKTypography variant="h2">Plébiscité par</MKTypography>
          <MKTypography variant="h2" color="info" textGradient mb={2}>
            plus de 15,000 apprenants
          </MKTypography>
          <MKTypography variant="body1" color="text" mb={2}>
            Universités, écoles et étudiants utilisent SENLAB-VISA pour apprendre et pratiquer en
            informatique et sciences.
          </MKTypography>
        </Grid>
        <Divider sx={{ my: 6 }} />
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={6} md={4} lg={2}>
            <MKBox
              component="img"
              src={appleLogo}
              alt="Université partenaire"
              width="100%"
              opacity={0.6}
            />
          </Grid>
          <Grid item xs={6} md={4} lg={2}>
            <MKBox
              component="img"
              src={facebookLogo}
              alt="Partenaire académique"
              width="100%"
              opacity={0.6}
            />
          </Grid>
          <Grid item xs={6} md={4} lg={2}>
            <MKBox
              component="img"
              src={nasaLogo}
              alt="Institution scientifique"
              width="100%"
              opacity={0.6}
            />
          </Grid>
          <Grid item xs={6} md={4} lg={2}>
            <MKBox
              component="img"
              src={vodafoneLogo}
              alt="Partenaire technologique"
              width="100%"
              opacity={0.6}
            />
          </Grid>
          <Grid item xs={6} md={4} lg={2}>
            <MKBox
              component="img"
              src={digitalOceanLogo}
              alt="Support technique"
              width="100%"
              opacity={0.6}
            />
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Information;
