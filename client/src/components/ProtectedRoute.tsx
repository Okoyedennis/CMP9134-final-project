import { Navigate } from "react-router-dom";
import { useCookies } from "../hooks/useCookies";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { getCookie } = useCookies();

  const isAuthenticated = () => {
    return !!getCookie("gcs_token");
  };

  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
