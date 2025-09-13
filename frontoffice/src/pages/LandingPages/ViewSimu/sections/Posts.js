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
      // ❌ on enlève height="100vh" et overflow="hidden"
      position="relative"
    >
      {/* En-tête de la simulation */}
      <MKBox p={2}>
        <MKTypography variant="h6" mb={0.5}>
          {simulation.titre}
        </MKTypography>
        <MKTypography variant="body2" color="text.secondary">
          Catégorie : {simulation.categorie} | {simulation.description}
        </MKTypography>
      </MKBox>

      {/* Iframe sans contrainte de viewport */}
      <MKBox width="100%">
        {simulation.iframeUrl && (
          <Grid container>
            <Grid item xs={12}>
              <iframe
                src={`http://localhost:5000${simulation.iframeUrl}`}
                title={simulation.titre}
                style={{
                  width: "100%",
                  minHeight: "1000px", // 👈 mettre une hauteur minimum au lieu de "100vh"
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
