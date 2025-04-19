// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
    const { user } = useContext(AuthContext);
    // If there's a logged-in user, render the protected component
    if (user) {
        return children;
    }
    // Otherwise redirect to login
    return <Navigate to="/login" replace />;
}
