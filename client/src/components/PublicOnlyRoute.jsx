import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

function PublicOnlyRoute() {
  const auth = useAuth();

  if (!auth.ready) {
    return <LoadingScreen />;
  }

  if (!auth.token || !auth.user) {
    return <Outlet />;
  }

  if (auth.mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  if (auth.user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/account" replace />;
}

export default PublicOnlyRoute;
