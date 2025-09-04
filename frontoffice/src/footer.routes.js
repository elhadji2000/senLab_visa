// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import YouTubeIcon from "@mui/icons-material/YouTube";

// Material Kit 2 React components
import MKTypography from "components/MKTypography";

// Images
import logoCT from "assets/logoLab.jpg";

const date = new Date().getFullYear();

export default {
  brand: {
    name: "SENLAB_VISA",
    image: logoCT,
    route: "/",
  },
  socials: [
    {
      icon: <FacebookIcon />,
      link: "#",
    },
    {
      icon: <TwitterIcon />,
      link: "#",
    },
    {
      icon: <GitHubIcon />,
      link: "#",
    },
    {
      icon: <YouTubeIcon />,
      link: "#",
    },
  ],
  menus: [
    {
      name: "À propos",
      items: [
        { name: "Qui sommes-nous ?", href: "#" },
        { name: "Notre mission", href: "#" },
        { name: "Équipe de recherche", href: "#" },
        { name: "Actualités", href: "#" },
      ],
    },
    {
      name: "Ressources",
      items: [
        { name: "Documentation", href: "#" },
        { name: "Tutoriels", href: "#" },
        { name: "Guides pratiques", href: "#" },
      ],
    },
    {
      name: "Aide & Support",
      items: [
        { name: "Contact", href: "#" },
        { name: "FAQ", href: "#" },
        { name: "Centre d’assistance", href: "#" },
      ],
    },
    {
      name: "Légal",
      items: [
        { name: "Conditions d’utilisation", href: "#" },
        { name: "Politique de confidentialité", href: "#" },
        { name: "Mentions légales", href: "#" },
      ],
    },
  ],
  copyright: (
    <MKTypography variant="button" fontWeight="regular">
      © {date} SENLAB_VISA — Laboratoire Virtuel. Tous droits réservés.
    </MKTypography>
  ),
};
