import React, { useContext } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // juste en haut

import Login from '../pages/Login';
import Footer2 from '../components/Footer2';
import LoadingSpinner from '../components/LoadingSpinner';
import Unauthorized from '../pages/Unauthorized';

import AdminDashboard from '../pages/dashboards/AdminDashboard';
import TeacherDashboard from '../pages/dashboards/TeacherDashboard';
import StudentDashboard from '../pages/dashboards/StudentDashboard';

import AddUsers from '../pages/users/AddUsers';
import ListUsers from '../pages/users/ListUsers';

import AddQuizz from '../pages/quizz/AddQuizz';
import ListQuizz from '../pages/quizz/ListQuizz';

import Toutes from '../pages/simulations/Toutes';
import Explorer from '../pages/simulations/Explorer';
import SimulationViewer from '../components/SimulationViewer';
import Ajouter from '../pages/simulations/Ajouter';

import ListeClasse from '../pages/professeur/classe/ListeClasse';
import CreerClasse from '../pages/professeur/classe/CreerClasse';
import Code from '../pages/professeur/codeClasse/Code';
import Gestion from '../pages/professeur/eleves/Gestion';
import FolderClasses from '../pages/professeur/classe/FolderClasses';
import ClasseDetails from '../pages/professeur/classe/ClasseDetails';
import AjouterElevesTable from '../pages/professeur/eleves/AjouterElevesTable';

import { AuthContext } from '../contexts/AuthContext';
import '../App.css';

function AppRouter() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <>
        <LoadingSpinner fullPage />
      </>
    );
  }


  return (
    <div className="page-container">
      {user && <Navbar />}     {/* Affiche la barre uniquement si connecté */}
      <main className="container-fluid" style={{ marginTop: '90px' }}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Navigate to={getDefaultRoute(user?.role)} />} />
          <Route path="/log" element={user ? <Navigate to={getDefaultRoute(user.role)} /> : <Login />} />

          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Routes protégées */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/dashboard"
              element={
                user?.role === 'admin' ? <AdminDashboard /> :
                  user?.role === 'enseignant' ? <TeacherDashboard /> :
                    <StudentDashboard />
              }
            />

            {/* Routes admin seulement */}
            <Route element={<RoleGuard allowedRoles={['admin']} />}>
              <Route path="/utilisateur/ajouter" element={<AddUsers />} />
              <Route path="/utilisateur/lister" element={<ListUsers />} />
            </Route>

            {/* Routes admin + enseignant */}
            <Route element={<RoleGuard allowedRoles={['admin', 'enseignant']} />}>
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

            {/* Accessible à tout utilisateur connecté */}
            <Route path="/simulations/all1" element={<Toutes />} />
            <Route path="/simulations/explorer" element={<Explorer />} />
            <Route path="/simulations/ajouter" element={<Ajouter />} />
            <Route path="/simulations/view/:id" element={<SimulationViewer />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/log"} />} />
        </Routes>
      </main>

      {user && <Footer2 />}
    </div>
  );
}

// ✅ Protège les routes (connexion requise)
const PrivateRoute = () => {
  const { user } = useContext(AuthContext);
  return user ? <Outlet /> : <Navigate to="/log" replace />;
};

// ✅ Protège selon le rôle
const RoleGuard = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/log" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};
const getDefaultRoute = (role) => {
  switch (role) {
    case 'admin': return '/dashboard';
    case 'enseignant': return '/dashboard';
    case 'etudiant': return '/dashboard';
    default: return '/log';
  }
};


export default AppRouter;
