import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from './context/authContext';

const ProtectedRoute = ({ children }) => {
  const { user } = UserAuth();

  if (!user) {
    // User not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // User authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
