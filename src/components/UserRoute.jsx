import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserRoute = () => {
  const { authToken, user } = useAuth();

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'remitter') {
    return <Navigate to="/user/unauthorized" replace />;
  }

  return <Outlet />;
};

export default UserRoute;