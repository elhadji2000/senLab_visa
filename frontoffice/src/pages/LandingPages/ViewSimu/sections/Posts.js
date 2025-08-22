// SimulationDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import { getSimulationById } from "services/simulationService";
import { Grid } from "@mui/material";

function Posts() {
  const { id } = useParams();
  const [simulation, setSimulation] = useState(null);

  useEffect(() => {
    if (id) {
      getSimulationById(id)
        .then((data) => setSimulation(data))
        .catch((err) => console.error("Erreur lors du chargement :", err));
    }
  }, [id]);

  if (!simulation) {
    return (
      <MKBox display="flex" justifyContent="center" alignItems="center" height="100vh">
        <MKTypography variant="h6" color="text">
          Chargement de la simulation...
        </MKTypography>
      </MKBox>
    );
  }

  return (
    <MKBox
      display="flex"
      flexDirection="column"
      width="100%"
      height="100vh"
      overflow="hidden"
      position="relative"
    >
      {/* En-tête de la simulation */}
      <MKBox p={2}>
        <MKTypography variant="h6" mb={0.5}>
          {simulation.titre}
        </MKTypography>
        <MKTypography variant="body2" color="text.secondary">
          Catégorie : {simulation.categorie}
        </MKTypography>
      </MKBox>

      {/* Iframe qui prend tout le reste de l'espace */}
      <MKBox flexGrow={1} height="100vh" overflow="hidden">
        {simulation.iframeUrl && (
          <Grid container sx={{ height: "100%" }}>
            <Grid item xs={12} sx={{ height: "100%" }}>
              <iframe
                src={`http://localhost:5000${simulation.iframeUrl}`}
                title={simulation.titre}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  overflow: "hidden",
                }}
                allowFullScreen
              />
            </Grid>
          </Grid>
        )}
      </MKBox>
    </MKBox>
  );
}

export default Posts;
