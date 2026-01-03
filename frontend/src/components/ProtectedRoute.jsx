import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, openAuthModal } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal('login');
    }
  }, [isAuthenticated, openAuthModal]);

  if (!isAuthenticated) {
    // Optionally return a loading spinner or a "Login Required" screen
    // while the modal is open.
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-gray-500">Please log in to continue...</p>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
