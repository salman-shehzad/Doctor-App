import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const dashboardPath = {
  patient: '/dashboard/patient',
  doctor: '/dashboard/doctor',
  assistant: '/dashboard/assistant',
  admin: '/dashboard/admin',
  super_admin: '/dashboard/super-admin'
};

const ProtectedRoute = ({ roles }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (roles?.length && !roles.includes(user?.role)) {
    return <Navigate to={dashboardPath[user?.role] || '/'} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
