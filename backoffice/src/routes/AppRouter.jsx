// AppRouter.jsx
import React, { useContext, useMemo } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer2 from "../components/Footer2";
import LoadingSpinner from "../components/LoadingSpinner";
import Unauthorized from "../pages/Unauthorized";

import AdminDashboard from "../pages/dashboards/AdminDashboard";
import TeacherDashboard from "../pages/dashboards/TeacherDashboard";
import StudentDashboard from "../pages/dashboards/StudentDashboard";

import AddUsers from "../pages/users/AddUsers";
import ListUsers from "../pages/users/ListUsers";

import AddQuizz from "../pages/quizz/AddQuizz";
import ListQuizz from "../pages/quizz/ListQuizz";

import Toutes from "../pages/simulations/Toutes";
import Explorer from "../pages/simulations/Explorer";
import SimulationViewer from "../components/SimulationViewer";
import Ajouter from "../pages/simulations/Ajouter";

import ListeClasse from "../pages/professeur/classe/ListeClasse";
import CreerClasse from "../pages/professeur/classe/CreerClasse";
import Code from "../pages/professeur/codeClasse/Code";
import Gestion from "../pages/professeur/eleves/Gestion";
import FolderClasses from "../pages/professeur/classe/FolderClasses";
import ClasseDetails from "../pages/professeur/classe/ClasseDetails";
import AjouterElevesTable from "../pages/professeur/eleves/AjouterElevesTable";

import { AuthContext } from "../contexts/AuthContext";
import "../App.css";

// ⚠️ Mets ici la vraie URL du frontoffice (port différent)
const FRONT_OFFICE_LOGIN =
  import.meta.env.VITE_FRONT_LOGIN_URL || "http://localhost:3000/pages/authentication/sign-in";

/** Redirection externe (changement d’origin) */
const ExternalRedirect = ({ to }) => {
  React.useEffect(() => {
    // replace() évite d’ajouter une entrée dans l’historique
    window.location.replace(to);
  }, [to]);
  return <LoadingSpinner fullPage text="Redirection vers la page de connexion..." />;
};

/** Construit l’URL de login frontoffice avec un param `next` (optionnel) */
const useFrontLoginUrl = () => {
  const location = useLocation();
  return useMemo(() => {
    try {
      const url = new URL(FRONT_OFFICE_LOGIN);
      // après login, le front peut te renvoyer vers `next` si tu le gères
      url.searchParams.set("next", window.location.origin + location.pathname);
      return url.toString();
    } catch {
      return FRONT_OFFICE_LOGIN; // fallback si FRONT_OFFICE_LOGIN n’est pas une URL absolue
    }
  }, [location]);
};

function AppRouter() {
  const { user, isLoading } = useContext(AuthContext);
  const frontLoginUrl = useFrontLoginUrl();

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <div className="page-container">
      {user && <Navbar />}
      <main className="container-fluid" style={{ marginTop: user ? "90px" : 0 }}>
        <Routes>
          {/* Racine */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to={getDefaultRoute(user.role)} replace />
              ) : (
                <ExternalRedirect to={frontLoginUrl} />
              )
            }
          />

          {/* Route de “login” interne -> redirige vers le frontoffice */}
          <Route path="/log" element={<ExternalRedirect to={frontLoginUrl} />} />

          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protégées */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardByRole />} />

            <Route element={<RoleGuard allowedRoles={["admin"]} />}>
              <Route path="/utilisateur/ajouter" element={<AddUsers />} />
              <Route path="/utilisateur/lister" element={<ListUsers />} />
            </Route>

            <Route element={<RoleGuard allowedRoles={["admin", "professeur"]} />}>
              <Route path="/quizz/lister" element={<ListQuizz />} />
              <Route path="/quizz/ajouter" element={<AddQuizz />} />
              <Route path="/quizz/edit/:id" element={<AddQuizz />} />
              <Route path="/simulations/ajouter" element={<Ajouter />} />
              <Route path="/classe/gerer" element={<ListeClasse />} />
              <Route path="/classe/creer" element={<CreerClasse />} />
              <Route path="/classe/folder" element={<FolderClasses />} />
              <Route path="/classes/:id/details" element={<ClasseDetails />} />
              <Route path="/codes/lister" element={<Code />} />
              <Route path="/eleves/lister" element={<Gestion />} />
              <Route path="/classes/:id/eleves/ajouter" element={<AjouterElevesTable />} />
            </Route>

            <Route path="/simulations/all1" element={<Toutes />} />
            <Route path="/simulations/explorer" element={<Explorer />} />
            <Route path="/simulations/view/:id" element={<SimulationViewer />} />
          </Route>

          {/* Fallback */}
          <Route
            path="*"
            element={user ? <Navigate to="/dashboard" replace /> : <ExternalRedirect to={frontLoginUrl} />}
          />
        </Routes>
      </main>

      {user && <Footer2 />}
    </div>
  );
}

/* Guards */

const PrivateRoute = () => {
  const { user, isLoading } = useContext(AuthContext);
  const frontLoginUrl = useFrontLoginUrl();
  if (isLoading) return <LoadingSpinner fullPage />;
  return user ? <Outlet /> : <ExternalRedirect to={frontLoginUrl} />;
};

const RoleGuard = ({ allowedRoles }) => {
  const { user, isLoading } = useContext(AuthContext);
  const frontLoginUrl = useFrontLoginUrl();
  if (isLoading) return <LoadingSpinner fullPage />;
  if (!user) return <ExternalRedirect to={frontLoginUrl} />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
};

const DashboardByRole = () => {
  const { user } = useContext(AuthContext);
  if (!user) return null;
  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "professeur":
      return <TeacherDashboard />;
    case "etudiant":
      return <StudentDashboard />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

const getDefaultRoute = (role) => {
  switch (role) {
    case "admin":
    case "professeur":
    case "etudiant":
      return "/dashboard";
    default:
      return "/unauthorized";
  }
};

export default AppRouter;
