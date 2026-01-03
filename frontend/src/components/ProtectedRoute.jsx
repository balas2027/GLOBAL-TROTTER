import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../services/auth.service';

const ProtectedRoute = () => {
  const user = getCurrentUser();
  const token = localStorage.getItem('token');

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
