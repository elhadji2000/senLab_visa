import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 React examples
import HorizontalTeamCard from "examples/Cards/TeamCards/HorizontalTeamCard";

// Images
import team1 from "assets/masse.jpg";
import team2 from "assets/mum.jpg";
import team3 from "assets/thio.jpg";
import team4 from "assets/sylla.jpg";

function Team() {
  return (
    <MKBox
      component="section"
      variant="gradient"
      bgColor="dark"
      position="relative"
      py={6}
      px={{ xs: 2, lg: 0 }}
      mx={-2}
    >
      <Container>
        <Grid container>
          <Grid item xs={12} md={8} sx={{ mb: 6 }}>
            <MKTypography variant="h3" color="white">
              Notre Équipe
            </MKTypography>
            <MKTypography variant="body2" color="white" opacity={0.8}>
              Ce projet de laboratoire virtuel est le fruit d’une collaboration entre
              enseignants-chercheurs, ingénieurs en informatique.Ensemble, nous mettons nos
              compétences au service de l’innovation pédagogique et scientifique.
            </MKTypography>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <MKBox mb={1}>
              <HorizontalTeamCard
                image={team1}
                name="Pr. [Nom de l’encadrant]"
                position={{ color: "info", label: "Encadrant principal" }}
                description="Professeur en informatique, "
              />
            </MKBox>
          </Grid>
          <Grid item xs={12} lg={6}>
            <MKBox mb={1}>
              <HorizontalTeamCard
                image={team2}
                name="Dr. [Nom]"
                position={{ color: "info", label: "Enseignant-chercheur" }}
                description="Spécialiste en systèmes informatiques, "
              />
            </MKBox>
          </Grid>
          <Grid item xs={12} lg={6}>
            <MKBox mb={{ xs: 1, lg: 0 }}>
              <HorizontalTeamCard
                image={team3}
                name="Ing. [Nom]"
                position={{ color: "info", label: "Ingénieur en informatique" }}
                description="Responsable de la conception"
              />
            </MKBox>
          </Grid>
          <Grid item xs={12} lg={6}>
            <MKBox mb={{ xs: 1, lg: 0 }}>
              <HorizontalTeamCard
                image={team4}
                name="[Nom]"
                position={{ color: "info", label: "Collaborateur" }}
                description="Participe activement au développement,"
              />
            </MKBox>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Team;
