import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin, roleLoading, role } = useContext(AuthContext);
  const location = useLocation();

  if (loading || roleLoading || (user && role === null)) {
    return (
      <div className="h-[97vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate to="/signin" state={location.pathname + location.search} />
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
