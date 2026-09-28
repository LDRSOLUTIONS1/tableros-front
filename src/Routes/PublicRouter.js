import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const PublicRouter = ({ isAuthenticated, children }) => {
  return !isAuthenticated ? children : <Navigate to="/Profile" replace />;
};

PublicRouter.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default PublicRouter;

