// src/routes/PrivateRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(Context);

  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
