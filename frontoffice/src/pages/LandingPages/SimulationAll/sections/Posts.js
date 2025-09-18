import React, { useEffect, useState, useRef } from "react";
import Container from "@mui/material/Container";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import TransparentBlogCard from "examples/Cards/BlogCards/TransparentBlogCard";
import { getAllSimulations } from "services/simulationService";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// Style CSS inline pour masquer la scrollbar
const hideScrollbarStyle = {
  msOverflowStyle: "none", // IE/Edge
  scrollbarWidth: "none", // Firefox
};
const hideScrollbarWebkit = `
  .no-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }
`;

function Places() {
  const [groupedSimulations, setGroupedSimulations] = useState({});
  const scrollRefs = useRef({});

  useEffect(() => {
    // injecter le style pour webkit au premier montage
    const styleTag = document.createElement("style");
    styleTag.innerHTML = hideScrollbarWebkit;
    document.head.appendChild(styleTag);

    getAllSimulations()
      .then((data) => {
        const grouped = data.reduce((acc, sim) => {
          if (!acc[sim.categorie]) acc[sim.categorie] = [];
          acc[sim.categorie].push(sim);
          return acc;
        }, {});
        setGroupedSimulations(grouped);
      })
      .catch((err) => console.error("Erreur lors du chargement :", err));
  }, []);

  const scroll = (categorie, direction) => {
    const scrollContainer = scrollRefs.current[categorie];
    if (scrollContainer) {
      const scrollAmount = 300; // distance de défilement par clic
      scrollContainer.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <MKBox component="section" py={4}>
      <Container>
        {Object.keys(groupedSimulations).map((categorie) => (
          <MKBox key={categorie} mb={6}>
            <MKTypography variant="h4" mb={2}>
              {categorie}
            </MKTypography>

            <div style={{ position: "relative" }}>
              {/* Flèche gauche */}
              <IconButton
                onClick={() => scroll(categorie, "left")}
                sx={{
                  position: "absolute",
                  top: "40%",
                  left: 0,
                  zIndex: 1,
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "grey.200" },
                }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>

              {/* Liste scrollable */}
              <div
                ref={(el) => (scrollRefs.current[categorie] = el)}
                className="no-scrollbar"
                style={{
                  display: "flex",
                  gap: "16px",
                  overflowX: "auto",
                  scrollBehavior: "smooth",
                  paddingBottom: "8px",
                  ...hideScrollbarStyle,
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

              {/* Flèche droite */}
              <IconButton
                onClick={() => scroll(categorie, "right")}
                sx={{
                  position: "absolute",
                  top: "40%",
                  right: 0,
                  zIndex: 1,
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "grey.200" },
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </div>
          </MKBox>
        ))}
      </Container>
    </MKBox>
  );
}

export default Places;
