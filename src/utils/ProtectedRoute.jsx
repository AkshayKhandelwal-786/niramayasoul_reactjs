import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');  // Fetch the token from localStorage
  const userId = localStorage.getItem('userid'); // Fetch the user ID from localStorage

  // Check if both token and userId exist
  if (!token || !userId) {
    // If not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  // If logged in, render the children (the protected route content)
  return children;
};

export default ProtectedRoute;
