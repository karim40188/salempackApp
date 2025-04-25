// src/routes/PublicRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { token } = useContext(Context);

  return !token ? children : <Navigate to="/" replace />;
};

export default PublicRoute;
