import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Forums from './pages/Forums';
import CategoryPosts from './pages/CategoryPosts';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen transition-all duration-300">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/forums" element={<Forums />} />
                <Route path="/forums/:categorySlug" element={<CategoryPosts />} />
                <Route path="/posts/:postId" element={<PostDetail />} />
                <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Private Route component
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

// Public Route component (redirect if logged in)
function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/forums" />;
}

export default App;