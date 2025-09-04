/* eslint-disable no-unused-vars */
import Card from "@mui/material/Card";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import Posts from "./sections/Posts";
import Footer from "./sections/Footer";
// Routes
import routes from "routes";

function ViewSimu() {
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
      <MKBox pt={6} px={3} mt={6}>
        <Posts />
      </MKBox>
      {/* Footer */}
      <MKBox pt={6} px={1} mt={6}>
        <Footer />
      </MKBox>
    </>
  );
}

export default ViewSimu;
