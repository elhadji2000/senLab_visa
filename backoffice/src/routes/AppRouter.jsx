import React, { useContext } from 'react'; // Ajoutez useContext ici
import Login from '../pages/Login';
import Footer2 from '../components/Footer2';
import Dashboard from '../pages/Dashboard';
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
// ... autres imports ...

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
            {/* Dashboard accessible à tous les rôles authentifiés */}
            <Route path="/dashboard" element={<Dashboard />} />

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