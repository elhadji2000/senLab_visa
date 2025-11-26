/* eslint-disable no-unused-vars */
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
import { useState } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import routes from "routes";
import footerRoutes from "footer.routes";
import bgImage from "assets/sen_visa1.jpg";

function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [response, setResponse] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/contact", formData);
      setResponse({
        open: true,
        message: " Votre message a bien été envoyé. Merci !",
        severity: "success",
      });
      setFormData({ name: "", email: "", message: "" }); //  vider les inputs
    } catch (error) {
      setResponse({
        open: true,
        message: " Une erreur est survenue. Veuillez réessayer.",
        severity: "error",
      });
    }
  };

  const handleClose = () => {
    setResponse({ ...response, open: false });
  };

  return (
    <>
      <MKBox position="fixed" top="0.5rem" width="100%">
        <DefaultNavbar
          routes={routes}
          action={{
            type: "internal",
            route: "/pages/landing-pages/about-us",
            label: "documentation",
            color: "info",
          }}
        />
      </MKBox>

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} lg={6}>
          <MKBox
            display={{ xs: "none", lg: "flex" }}
            width="calc(100% - 2rem)"
            height="calc(100vh - 2rem)"
            borderRadius="lg"
            ml={2}
            mt={2}
            sx={{
              backgroundImage: `url(${bgImage})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={10}
          md={7}
          lg={6}
          xl={4}
          ml={{ xs: "auto", lg: 6 }}
          mr={{ xs: "auto", lg: 6 }}
        >
          <MKBox
            bgColor="white"
            borderRadius="xl"
            shadow="lg"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={{ xs: 20, sm: 18, md: 20 }}
            mb={{ xs: 20, sm: 18, md: 20 }}
            mx={3}
          >
            {/* Titre */}
            <MKBox
              variant="gradient"
              bgColor="info"
              coloredShadow="info"
              borderRadius="lg"
              p={2}
              mx={2}
              mt={-3}
            >
              <MKTypography variant="h3" color="white">
                Nous contacter
              </MKTypography>
            </MKBox>

            {/* Formulaire */}
            <MKBox p={3}>
              <MKTypography variant="body2" color="text" mb={3}>
                Pour toute question supplémentaire, y compris les opportunités de partenariat,
                veuillez nous écrire à <b>contact@senlab.edu.com</b> ou utiliser le formulaire
                ci-dessous.
              </MKTypography>

              <MKBox component="form" method="post" autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <MKInput
                      variant="standard"
                      label="Nom complet"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MKInput
                      type="email"
                      variant="standard"
                      label="Adresse e-mail"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput
                      variant="standard"
                      label="Comment pouvons-nous vous aider ?"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      multiline
                      rows={6}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid container item justifyContent="center" xs={12} mt={5} mb={2}>
                  <MKButton type="submit" variant="gradient" color="info">
                    Envoyer le message
                  </MKButton>
                </Grid>
              </MKBox>

              {/*  Notification en haut à droite */}
              <Snackbar
                open={response.open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Alert onClose={handleClose} severity={response.severity} sx={{ width: "100%" }}>
                  {response.message}
                </Alert>
              </Snackbar>
            </MKBox>
          </MKBox>
        </Grid>
      </Grid>

      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default ContactUs;
