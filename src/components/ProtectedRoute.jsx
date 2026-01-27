import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const permisos = user.permisos || [];

  if (!requiredPermission) {
    return children;
  }

  const tienePermiso = permisos.includes(requiredPermission);

  if (!tienePermiso) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;