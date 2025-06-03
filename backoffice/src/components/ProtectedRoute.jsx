// src/components/ProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/log" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role; // Supposant que votre JWT contient un champ 'role'

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error('Token invalide:', error);
    return <Navigate to="/log" replace />;
  }
};

export default ProtectedRoute;