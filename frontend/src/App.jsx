import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext'; // Ensure AuthProvider is imported
import Landing from './pages/Landing'; // Import the new Landing page
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Whiteboard from './pages/Whiteboard';
import MeetingDetail from './pages/MeetingDetail';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />; // Redirect to landing page
  }
  return children;
};

const AuthRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (user) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Root route renders the Landing page */}
          <Route path="/" element={<Landing />} />
          
          {/* Auth Routes: Redirect to dashboard if already logged in */}
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <Signup />
              </AuthRoute>
            }
          />
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />

          {/* Protected Routes: Redirect to landing page if not logged in */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/whiteboard/:meetingId"
            element={
              <ProtectedRoute>
                <Whiteboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meeting/:meetingId"
            element={
              <ProtectedRoute>
                <MeetingDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;