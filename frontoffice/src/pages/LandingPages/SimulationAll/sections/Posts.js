import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import TransparentBlogCard from "examples/Cards/BlogCards/TransparentBlogCard";
import { getAllSimulations } from "services/simulationService";

function Places() {
  const [groupedSimulations, setGroupedSimulations] = useState({});

  useEffect(() => {
    getAllSimulations()
      .then((data) => {
        // Regrouper les simulations par catégorie
        const grouped = data.reduce((acc, sim) => {
          if (!acc[sim.categorie]) acc[sim.categorie] = [];
          acc[sim.categorie].push(sim);
          return acc;
        }, {});
        setGroupedSimulations(grouped);
      })
      .catch((err) => console.error("Erreur lors du chargement :", err));
  }, []);

  return (
    <MKBox component="section" py={4}>
      <Container>
        {Object.keys(groupedSimulations).map((categorie) => (
          <MKBox key={categorie} mb={6}>
            {/* Titre de la catégorie */}
            <MKTypography variant="h4" mb={2}>
              {categorie}
            </MKTypography>

            {/* Ligne scrollable */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                overflowX: "auto",
                scrollbarWidth: "thin",
                paddingBottom: "8px",
              }}
            >
              {groupedSimulations[categorie].map((sim) => (
                <div key={sim._id} style={{ flex: "0 0 auto", minWidth: "220px" }}>
                  <TransparentBlogCard
                    image={`http://localhost:5000${sim.photo}`}
                    title={sim.titre}
                    description={sim.categorie}
                    action={{
                      type: "internal",
                      route: `/simulations/${sim._id}`,
                      color: "info",
                      label: "",
                    }}
                  />
                </div>
              ))}
            </div>
          </MKBox>
        ))}
      </Container>
    </MKBox>
  );
}

export default Places;
