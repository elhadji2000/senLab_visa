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
      id: "facebook",
      icon: <FacebookIcon />,
      link: "#",
    },
    {
      id: "twitter",
      icon: <TwitterIcon />,
      link: "#",
    },
    {
      id: "github",
      icon: <GitHubIcon />,
      link: "#",
    },
    {
      id: "youtube",
      icon: <YouTubeIcon />,
      link: "#",
    },
  ],
  menus: [
    {
      name: "À propos",
      items: [
        { id: "qui", name: "Qui sommes-nous ?", href: "#" },
        { id: "mission", name: "Notre mission", href: "#" },
        { id: "equipe", name: "Équipe de recherche", href: "#" },
        { id: "actus", name: "Actualités", href: "#" },
      ],
    },
    {
      name: "Ressources",
      items: [
        { id: "doc", name: "Documentation", href: "#" },
        { id: "tutos", name: "Tutoriels", href: "#" },
        { id: "guides", name: "Guides pratiques", href: "#" },
      ],
    },
    {
      name: "Aide & Support",
      items: [
        { id: "contact", name: "Contact", href: "#" },
        { id: "faq", name: "FAQ", href: "#" },
        { id: "support", name: "Centre d’assistance", href: "#" },
      ],
    },
    {
      name: "Légal",
      items: [
        { id: "cgu", name: "Conditions d’utilisation", href: "#" },
        { id: "privacy", name: "Politique de confidentialité", href: "#" },
        { id: "mentions", name: "Mentions légales", href: "#" },
      ],
    },
  ],
  copyright: (
    <MKTypography variant="button" fontWeight="regular">
      © {date} SENLAB_VISA — Laboratoire Virtuel. Tous droits réservés.
    </MKTypography>
  ),
};
