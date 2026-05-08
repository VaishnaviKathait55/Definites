import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

function ProtectedRoute({ roles = [], allowPasswordChangeOnly = false }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.ready) {
    return <LoadingScreen />;
  }

  if (!auth.token || !auth.user) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (auth.mustChangePassword && !allowPasswordChangeOnly) {
    return <Navigate to="/change-password" replace />;
  }

  if (roles.length > 0 && !roles.includes(auth.user.role)) {
    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
