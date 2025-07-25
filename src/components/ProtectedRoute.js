// File: src/components/ProtectedRoute.js

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * A component to protect routes based on authentication and user roles.
 * @param {object} props
 * @param {React.ReactNode} props.children - The component to render if authorized.
 * @param {string[]} [props.allowedRoles] - An optional array of roles that are allowed to access the route (e.g., ['Admin', 'Customer']).
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, currentUser, loading } = useAuth();
  const location = useLocation();

  // Show a loading state while the authentication status is being determined
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Checking authentication...</div>;
  }

  // 1. If user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    // Pass the original location to redirect back after successful login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If the route specifies allowed roles and the current user's role is not included, redirect them.
  // We use toLowerCase() for a case-insensitive comparison to make it more robust.
  if (allowedRoles && !allowedRoles.some(role => role.toLowerCase() === currentUser.role.toLowerCase())) {
    // User is logged in but doesn't have the required role. Redirect to home page.
    return <Navigate to="/" replace />;
  }
  
  // 3. If all checks pass, render the requested component
  return children;
};

export default ProtectedRoute;