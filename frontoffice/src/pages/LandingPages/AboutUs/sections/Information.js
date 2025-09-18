import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";

// Material Kit 2 React examples
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import CenteredBlogCard from "examples/Cards/BlogCards/CenteredBlogCard";
import blogImage from "assets/senLab2.jpg";

function Information() {
  return (
    <MKBox component="section" py={12}>
      <Container>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} lg={6}>
            <Grid container justifyContent="flex-start">
              <Grid item xs={12} md={6}>
                <MKBox mb={5}>
                  <DefaultInfoCard
                    icon="public"
                    title="Entièrement intégré"
                    description="Tous les modules et fonctionnalités sont connectés pour une expérience d’apprentissage fluide."
                  />
                </MKBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <MKBox mb={5}>
                  <DefaultInfoCard
                    icon="payments"
                    title="Suivi des progrès"
                    description="Visualisez vos résultats et vos scores dans les quizz et simulations pour suivre vos progrès."
                  />
                </MKBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <MKBox mb={{ xs: 5, md: 0 }}>
                  <DefaultInfoCard
                    icon="apps"
                    title="Modules préconstruits"
                    description="Accédez rapidement à des simulations et exercices déjà prêts à l’usage pour gagner du temps."
                  />
                </MKBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <MKBox mb={{ xs: 5, md: 0 }}>
                  <DefaultInfoCard
                    icon="3p"
                    title="Plateforme améliorée"
                    description="Une interface moderne et optimisée pour un apprentissage pratique et interactif."
                  />
                </MKBox>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
            <CenteredBlogCard
              image={blogImage}
              title="Découvrez nos astuces"
              description="Explorez nos conseils pour utiliser SENLAB-VISA efficacement et tirer le meilleur parti de chaque module."
              action={{
                type: "internal",
                route: "pages/company/about-us",
                color: "info",
                label: "En savoir plus",
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Information;
