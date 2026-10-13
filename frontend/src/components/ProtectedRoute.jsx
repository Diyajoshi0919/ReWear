import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

// Sends logged-out users to the login page, then back here after they log in
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
};

export default ProtectedRoute;
