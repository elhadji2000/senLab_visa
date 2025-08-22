import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

import TransparentBlogCard from "examples/Cards/BlogCards/TransparentBlogCard";
import { getAllSimulations } from "services/simulationService";

function Places() {
  const [simulations, setSimulations] = useState([]);

  useEffect(() => {
    getAllSimulations()
      .then((data) => setSimulations(data))
      .catch((err) => console.error("Erreur lors du chargement :", err));
  }, []);

  return (
    <MKBox component="section" py={2}>
      <Container>
        <Grid container item xs={12} lg={6}>
          <MKTypography variant="h3" mb={6}>
            Nos dernières simulations
          </MKTypography>
        </Grid>
        <Grid container spacing={3}>
          {simulations.map((sim) => (
            <Grid item xs={12} sm={8} lg={2} key={sim._id}>
              <TransparentBlogCard
                image={`http://localhost:5000${sim.photo}`}
                title={sim.titre}
                description={sim.categorie}
                action={{
                  type: "internal",
                  route: `/simulations/${sim._id}`,
                  color: "info",
                  label: "voir",
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Places;
