/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MuiLink from "@mui/material/Link";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// TransparentBlogCard.jsx

function TransparentBlogCard({ image, title, description, action }) {
  return (
    <Card
      sx={{
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        p: 1.5,
        textAlign: "center",
        height: "260px",
        maxWidth: "300px", // ↑ largeur augmentée
        width: "100%", // occupe tout l'espace disponible
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.2s ease-in-out",
        "&:hover": { transform: "translateY(-4px)" },
      }}
    >
      <Link to={action.route} style={{ textDecoration: "none" }}>
        <MKBox position="relative" borderRadius="lg" mb={1} width="100%">
          <MKBox
            component="img"
            src={image}
            alt={title}
            borderRadius="lg"
            shadow="sm"
            sx={{
              width: "100%",
              height: "180px", // ✅ hauteur augmentée (au lieu de 130px)
              objectFit: "cover", // ✅ garde le remplissage
              display: "block",
            }}
          />
        </MKBox>
      </Link>

      <MKTypography
        variant="h6"
        gutterBottom
        sx={{
          fontSize: "0.85rem",
          fontWeight: 600,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {title}
      </MKTypography>

      <MKTypography
        variant="body2"
        color="text.secondary"
        sx={{
          fontSize: "0.7rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
        }}
      >
        {description}
      </MKTypography>
    </Card>
  );
}

TransparentBlogCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.shape({
    type: PropTypes.oneOf(["external", "internal"]),
    route: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    color: PropTypes.oneOf([
      "inherit",
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "light",
      "dark",
      "text",
    ]).isRequired,
  }).isRequired,
};

export default TransparentBlogCard;
