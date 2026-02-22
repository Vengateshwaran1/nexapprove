import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';

interface ProtectedRouteProps {
  allowedRoles: Array<'SUPER_ADMIN' | 'ORG_ADMIN' | 'USER'>;
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && !allowedRoles.includes(user.systemRole)) {
    // Redirect to their default dashboard based on their role
    switch (user.systemRole) {
      case 'SUPER_ADMIN':
        return <Navigate to="/super-admin/dashboard" replace />;
      case 'ORG_ADMIN':
        return <Navigate to="/org-admin/dashboard" replace />;
      case 'USER':
        return <Navigate to="/user/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
