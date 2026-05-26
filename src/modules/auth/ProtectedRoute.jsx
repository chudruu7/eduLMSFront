// src/modules/auth/ProtectedRoute.jsx
import { useAuth } from './AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ children, allowed }) {
  const { me, loading } = useAuth(); // <--- loading-ийг авна

  if (loading) {
    return <div>Ачаалж байна...</div>; // Ачаалах зуур хүлээх
  }

  if (!me) {
    return <Navigate to="/login" replace />;
  }

  if (allowed && !allowed.includes(me.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children || <Outlet />;
}