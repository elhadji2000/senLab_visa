import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import TransparentBlogCard from "examples/Cards/BlogCards/TransparentBlogCard";

import { getAllSimulations } from "services/simulationService";

function Posts() {
  const [simulations, setSimulations] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],
    niveaux: [],
  });
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    niveaux: true,
  });

  // Charger les simulations
  useEffect(() => {
    getAllSimulations()
      .then((data) => setSimulations(data))
      .catch((err) => console.error("Erreur lors du chargement :", err));
  }, []);

  // ✅ Gérer les changements de checkbox
  const handleFilterChange = (category, value) => {
    setFilters((prev) => {
      const newValues = prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value];
      return { ...prev, [category]: newValues };
    });
  };

  // ✅ Gérer l'expansion des sections de filtres
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // ✅ Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      categories: [],
      niveaux: [],
    });
  };

  // ✅ Appliquer les filtres
  const filteredSimulations = simulations.filter((sim) => {
    const matchCategorie =
      filters.categories.length === 0 || filters.categories.includes(sim.categorie);
    const matchNiveau = filters.niveaux.length === 0 || filters.niveaux.includes(sim.niveau);
    return matchCategorie && matchNiveau;
  });

  // ✅ Regrouper les niveaux par catégorie scolaire
  const niveauxScolaires = {
    "École élémentaire": ["CP", "CE1", "CE2", "CM1", "CM2"],
    Collège: ["6e", "5e", "4e", "3e"],
    Lycée: ["2nde", "1ère", "Terminale"],
  };

  return (
    <MKBox component="section" py={4} sx={{ minHeight: "100vh" }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* ===== Panneau de contrôle à gauche ===== */}
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 4,
                backgroundColor: "white",
                height: "100%", // Prend toute la hauteur disponible
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <MKTypography variant="h5" fontWeight="bold">
                  🎛️ Filtres
                </MKTypography>
                <MKButton
                  variant="text"
                  color="info"
                  size="small"
                  onClick={resetFilters}
                  sx={{ fontSize: "0.75rem" }}
                >
                  Réinitialiser
                </MKButton>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {/* Catégorie */}
              <Box mb={3}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  onClick={() => toggleSection("categories")}
                  sx={{ cursor: "pointer" }}
                >
                  <MKTypography variant="h6" gutterBottom fontWeight="medium">
                    Catégorie
                  </MKTypography>
                  <IconButton size="small">
                    {expandedSections.categories ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>
                <Collapse in={expandedSections.categories}>
                  <FormGroup sx={{ pl: 1 }}>
                    {["Mathematique", "Physique", "Chimie", "SVT"].map((cat) => (
                      <FormControlLabel
                        key={cat}
                        control={
                          <Checkbox
                            size="small"
                            checked={filters.categories.includes(cat)}
                            onChange={() => handleFilterChange("categories", cat)}
                          />
                        }
                        label={
                          <MKTypography variant="button" fontWeight="regular">
                            {cat}
                          </MKTypography>
                        }
                        sx={{ mb: 0.5 }}
                      />
                    ))}
                  </FormGroup>
                </Collapse>
              </Box>

              {/* Niveau scolaire */}
              <Box sx={{ flexGrow: 1 }}>
                {" "}
                {/* Permet à cette section de prendre l'espace disponible */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  onClick={() => toggleSection("niveaux")}
                  sx={{ cursor: "pointer" }}
                >
                  <MKTypography variant="h6" gutterBottom fontWeight="medium">
                    Niveau scolaire
                  </MKTypography>
                  <IconButton size="small">
                    {expandedSections.niveaux ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>
                <Collapse in={expandedSections.niveaux}>
                  {Object.entries(niveauxScolaires).map(([categorie, niveaux]) => (
                    <Box key={categorie} mb={2}>
                      <MKTypography
                        variant="caption"
                        fontWeight="bold"
                        color="text"
                        display="block"
                        mb={1}
                      >
                        {categorie}
                      </MKTypography>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {niveaux.map((n) => (
                          <Chip
                            key={n}
                            label={n}
                            size="small"
                            variant={filters.niveaux.includes(n) ? "filled" : "outlined"}
                            color="info"
                            onClick={() => handleFilterChange("niveaux", n)}
                            sx={{ mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Collapse>
              </Box>
            </Paper>
          </Grid>

          {/* ===== Simulations à droite ===== */}
          <Grid item xs={12} md={9}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <MKTypography variant="h3" fontWeight="bold">
                Nos dernières simulations
              </MKTypography>
              <MKTypography variant="body2" color="text">
                {filteredSimulations.length} simulation(s) trouvée(s)
              </MKTypography>
            </Box>

            {filteredSimulations.length > 0 ? (
              <Grid container spacing={3}>
                {" "}
                {/* ↓ moins d'espace entre les cartes */}
                {filteredSimulations.map((sim) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={sim._id}
                    display="flex"
                    justifyContent="center"
                  >
                    <TransparentBlogCard
                      image={`http://localhost:5000${sim.photo}`}
                      title={sim.titre}
                      description={`${sim.categorie} • ${sim.niveau}`}
                      action={{
                        type: "internal",
                        route: `/simulations/${sim._id}`,
                        color: "info",
                        label: "Voir la simulation",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <MKBox
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                py={10}
                textAlign="center"
              >
                <MKTypography variant="h4" color="text" mb={2}>
                  Aucune simulation trouvée
                </MKTypography>
                <MKTypography variant="body1" color="text" mb={3}>
                  Essayez de modifier vos critères de filtrage
                </MKTypography>
                <MKButton variant="gradient" color="info" onClick={resetFilters}>
                  Réinitialiser les filtres
                </MKButton>
              </MKBox>
            )}
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Posts;
