import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Basic validation
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        navigate('/forums');
      } else {
        setErrors({ general: result.error.detail || 'Invalid credentials' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-dust-300 dark:bg-amethyst-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blush-300 dark:bg-plum-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="card p-8 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Heart className="h-12 w-12 text-rose-dust-600 dark:text-amethyst-400" />
                <div className="absolute inset-0 h-12 w-12 bg-rose-dust-400 dark:bg-amethyst-400 rounded-full opacity-20 animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
            <p className="text-gray-600 dark:text-amethyst-200">
              Sign in to continue your mental health journey
            </p>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{errors.general}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-amethyst-200 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 dark:text-amethyst-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.username ? 'border-red-500 dark:border-red-500' : ''}`}
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-amethyst-200 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-amethyst-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500 dark:border-red-500' : ''}`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 dark:text-amethyst-400 hover:text-gray-600 dark:hover:text-amethyst-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 dark:text-amethyst-400 hover:text-gray-600 dark:hover:text-amethyst-300" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center relative"
            >
              {isLoading ? (
                <>
                  <div className="spinner mr-2"></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-amethyst-200">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-rose-dust-600 dark:text-amethyst-400 font-medium hover:text-rose-dust-700 dark:hover:text-amethyst-300 transition-colors"
              >
                Join our community
              </Link>
            </p>
          </div>

          {/* Privacy Note */}
          <div className="mt-6 p-4 bg-rose-dust-50 dark:bg-amethyst-800/50 rounded-lg">
            <p className="text-xs text-center text-gray-600 dark:text-amethyst-300">
              Your privacy is our priority. All interactions are anonymous and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;