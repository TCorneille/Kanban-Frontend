import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Read token synchronously from storage
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;