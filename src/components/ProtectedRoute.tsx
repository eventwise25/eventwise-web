import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate } from "react-router-dom";
import { JSX } from "react";

interface Props {
  role?: "admin" | "organizer";
  children: JSX.Element;
}

const ProtectedRoute = ({ role, children }: Props) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/dashboard" />;

  return children;
};

export default ProtectedRoute;
