import React, { useContext } from 'react';
import Login from '../pages/Login';
import Footer2 from '../components/Footer2';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import TeacherDashboard from '../pages/dashboards/TeacherDashboard';
import StudentDashboard from '../pages/dashboards/StudentDashboard';
import Layout from '../components/Layout';
import AddUsers from '../pages/users/AddUsers';
import ListUsers from '../pages/users/ListUsers';
import ListQuizz from '../pages/quizz/ListQuizz';
import AddQuizz from '../pages/quizz/AddQuizz';
import Toutes from '../pages/simulations/Toutes';
import Ajouter from '../pages/simulations/Ajouter';
import Explorer from '../pages/simulations/explorer';
import CircularProgress from '@mui/material/CircularProgress';
import ProtectedRoute from '../components/ProtectedRoute';
import '../App.css';
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Unauthorized from '../pages/Unauthorized';
import ListeClasse from '../pages/professeur/classe/ListeClasse';
import CreerClasse from '../pages/professeur/classe/CreerClasse';
import Code from '../pages/professeur/codeClasse/Code';
import Gestion from '../pages/professeur/eleves/Gestion';

function AppRouter() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="page-container">
      <main className="container-fluid">
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/log"} />} />
          <Route path="/log" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Routes protégées */}
          <Route element={<ProtectedLayout />}>
            {/* Dashboard spécifique au rôle */}
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
              <Route path="/simulations/ajouter" element={<Ajouter />} />
              <Route path="/classe/gerer" element={<ListeClasse />} />
              <Route path="/classe/creer" element={<CreerClasse />} />
              <Route path="/codes/lister" element={<Code />} />
              <Route path="/eleves/lister" element={<Gestion />} />
            </Route>

            {/* Routes accessibles à tous les utilisateurs connectés */}
            <Route path="/simulations/all1" element={<Toutes />} />
            <Route path="/simulations/explorer" element={<Explorer />} />
          </Route>

          {/* Redirection pour les routes non trouvées */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/log"} />} />
        </Routes>
      </main>
      
      {user && <Footer2 />}
    </div>
  );
}

// Composant de protection du layout
const ProtectedLayout = () => {
  const { user } = useContext(AuthContext);
  return user ? <Layout><Outlet /></Layout> : <Navigate to="/log" replace />;
};

// Garde de rôle
const RoleGuard = ({ allowedRoles, children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/log" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

export default AppRouter;