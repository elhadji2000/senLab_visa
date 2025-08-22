// @mui material components
import Icon from "@mui/material/Icon";

// @mui icons
import GitHubIcon from "@mui/icons-material/GitHub";

// Pages
import AboutUs from "layouts/pages/landing-pages/about-us";
import Quizzes from "layouts/pages/landing-pages/quizz-all";
import SimuPage from "layouts/pages/landing-pages/simulation";
import SignIn from "layouts/pages/authentication/sign-in";
// Sections

const routes = [
  {
    name: "pages",
    icon: <Icon>dashboard</Icon>,
    columns: 1,
    rowsPerColumn: 2,
    collapse: [
      {
        name: "landing pages",
        collapse: [
          {
            name: "Apropos",
            route: "/pages/landing-pages/about-us",
            component: <AboutUs />,
          },
          {
            name: "contactez nous",
            route: "/pages/landing-pages/contact-us",
            component: <Quizzes />,
          },
        ],
      },
      {
        name: "compte",
        collapse: [
          {
            name: "connexion",
            route: "/pages/authentication/sign-in",
            component: <SignIn />,
          },
        ],
      },
    ],
  },
  {
    name: "sections",
    icon: <Icon>view_day</Icon>,
    collapse: [
      {
        name: "simulations",
        description: "See all simulations",
        dropdown: true,
        collapse: [
          {
            name: "Explorer",
            route: "/sections/page-sections/simu",
            component: <SimuPage />,
          },
          {
            name: "Tous les Simulations",
            route: "/sections/page-sections/simu",
            component: <SimuPage />,
          },
        ],
      },
      {
        name: "Quizzes",
        description: "See all quizzes",
        route: "/sections/navigation/navbars",
        component: <Quizzes />,
      },
    ],
  },
  {
    name: "github",
    icon: <GitHubIcon />,
    href: "https://github.com/elhadji2000/senLab_visa",
  },
];

export default routes;
