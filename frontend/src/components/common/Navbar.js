import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Heart, Menu, X, User, LogOut, MessageSquare, Plus, Moon, Sun, Home } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav className="glass border-b border-rose-dust-200 dark:border-amethyst-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Heart className="h-8 w-8 text-rose-dust-600 dark:text-amethyst-400 group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute inset-0 h-8 w-8 bg-rose-dust-400 dark:bg-amethyst-400 rounded-full opacity-20 group-hover:animate-pulse"></div>
            </div>
            <span className="text-xl font-bold gradient-text">MindConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`nav-link flex items-center space-x-1 ${isActivePath('/') ? 'active' : ''}`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/forums" 
              className={`nav-link flex items-center space-x-1 ${isActivePath('/forums') || location.pathname.startsWith('/forums') ? 'active' : ''}`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Forums</span>
            </Link>

            {user ? (
              <>
                <Link 
                  to="/create-post" 
                  className="btn-primary flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Post</span>
                </Link>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="btn-ghost p-2"
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 btn-ghost">
                    <User className="h-4 w-4" />
                    <span className="max-w-32 truncate">{user.display_name || user.username}</span>
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                    <div className="py-2">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 nav-link hover:bg-rose-dust-50 dark:hover:bg-amethyst-700"
                      >
                        Profile Settings
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 nav-link hover:bg-rose-dust-50 dark:hover:bg-amethyst-700 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Theme Toggle for non-authenticated users */}
                <button
                  onClick={toggleTheme}
                  className="btn-ghost p-2"
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>

                <Link to="/login" className="btn-ghost">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Join Us
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="btn-ghost p-2"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn-ghost p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-rose-dust-200 dark:border-amethyst-700 animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className={`block px-3 py-2 nav-link ${isActivePath('/') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <Link 
                to="/forums" 
                className={`block px-3 py-2 nav-link ${isActivePath('/forums') || location.pathname.startsWith('/forums') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Forums
              </Link>

              {user ? (
                <>
                  <Link 
                    to="/create-post" 
                    className="block px-3 py-2 nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Post
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block px-3 py-2 nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 nav-link"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-3 py-2 nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;