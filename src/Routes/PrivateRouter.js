import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

export const PrivateRouter = ({ isAuthenticated, component: Component }) => {
  const lastPath = window.location.pathname;
  localStorage.setItem("lastPath", lastPath);

  return isAuthenticated ? <Component /> : <Navigate to="/" replace />;
};

PrivateRouter.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
};
