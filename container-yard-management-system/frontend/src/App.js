import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/App.css';

// Import components
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import MajorHubs from './components/MajorHubs';
import RouteVisualizer from './components/RouteVisualizer';
import ProtectedRoute from './components/ProtectedRoute';

// Import authentication context
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/major-hubs"
            element={
              <ProtectedRoute>
                <MajorHubs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/route-visualizer"
            element={
              <ProtectedRoute>
                <RouteVisualizer />
              </ProtectedRoute>
            }
          />

          {/* Fallback route - redirect to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
