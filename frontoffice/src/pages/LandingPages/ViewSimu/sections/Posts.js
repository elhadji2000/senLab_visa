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
    <MKBox display="flex" flexDirection="column" width="100%">
      {/* En-tête de la simulation */}
      <MKBox p={2}>
        <MKTypography variant="h6" mb={0.5}>
          {simulation.titre}
        </MKTypography>
        <MKTypography variant="body2" color="text.secondary">
          Catégorie : {simulation.categorie} | {simulation.description}
        </MKTypography>
      </MKBox>

      {/* Conteneur avec scroll horizontal */}
      <MKBox
        width="100%"
        sx={{
          overflowX: "auto", // 👈 scroll horizontal si contenu plus large
          overflowY: "hidden",
        }}
      >
        {simulation.iframeUrl && (
          <Grid container>
            <Grid item xs={12}>
              <iframe
                src={`http://localhost:5000${simulation.iframeUrl}`}
                title={simulation.titre}
                style={{
                  display: "block",
                  minWidth: "1200px", // 👈 largeur réelle de la simulation si connue
                  width: "100%", // 👈 s'adapte mais peut dépasser avec scroll
                  minHeight: "1000px",
                  border: "none",
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
