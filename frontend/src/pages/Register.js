import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Eye, EyeOff, Lock, User, Mail, AlertCircle, CheckCircle, Shield } from 'lucide-react';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Display name validation (optional)
    if (formData.displayName && formData.displayName.length > 50) {
      newErrors.displayName = 'Display name must be less than 50 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(
        formData.username,
        formData.password,
        formData.confirmPassword,
        formData.displayName
      );
      
      if (result.success) {
        navigate('/forums');
      } else {
        // Handle specific backend errors
        if (result.error.username) {
          setErrors({ username: result.error.username[0] });
        } else if (result.error.password) {
          setErrors({ password: result.error.password[0] });
        } else {
          setErrors({ general: result.error.detail || 'Registration failed' });
        }
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, text: '', color: '' };

    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    strength = Object.values(checks).filter(Boolean).length;

    if (strength <= 2) return { strength, text: 'Weak', color: 'red' };
    if (strength <= 3) return { strength, text: 'Fair', color: 'yellow' };
    if (strength <= 4) return { strength, text: 'Good', color: 'blue' };
    return { strength, text: 'Strong', color: 'green' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rose-dust-300 dark:bg-amethyst-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blush-300 dark:bg-plum-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
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
            <h1 className="text-3xl font-bold gradient-text mb-2">Join MindConnect</h1>
            <p className="text-gray-600 dark:text-amethyst-200">
              Create your anonymous account and start your journey
            </p>
          </div>

          {/* Privacy Notice */}
          <div className="mb-6 p-4 bg-baby-blue-50 dark:bg-amethyst-800/50 rounded-lg border border-baby-blue-200 dark:border-amethyst-600">
            <div className="flex items-start space-x-2">
              <Shield className="h-5 w-5 text-baby-blue-600 dark:text-amethyst-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-baby-blue-900 dark:text-amethyst-200">Privacy Protected</h3>
                <p className="text-xs text-baby-blue-700 dark:text-amethyst-300 mt-1">
                  Your real identity remains anonymous. Only you control what you share.
                </p>
              </div>
            </div>
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
                Username <span className="text-red-500">*</span>
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
                  placeholder="Choose a unique username"
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-amethyst-400">
                This will be visible to other users (but still anonymous)
              </p>
            </div>

            {/* Display Name Field */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-amethyst-200 mb-2">
                Display Name <span className="text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-amethyst-400" />
                </div>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.displayName ? 'border-red-500 dark:border-red-500' : ''}`}
                  placeholder="How you'd like to be called"
                  disabled={isLoading}
                />
              </div>
              {errors.displayName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.displayName}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-amethyst-200 mb-2">
                Password <span className="text-red-500">*</span>
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
                  placeholder="Create a strong password"
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 dark:bg-amethyst-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.color === 'red' ? 'bg-red-500' :
                          passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                          passwordStrength.color === 'blue' ? 'bg-baby-blue-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength.color === 'red' ? 'text-red-600 dark:text-red-400' :
                      passwordStrength.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                      passwordStrength.color === 'blue' ? 'text-baby-blue-600 dark:text-baby-blue-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-amethyst-200 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-amethyst-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500 dark:border-red-500' : ''}`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 dark:text-amethyst-400 hover:text-gray-600 dark:hover:text-amethyst-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 dark:text-amethyst-400 hover:text-gray-600 dark:hover:text-amethyst-300" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
              )}
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && formData.password && (
                <div className="mt-1 flex items-center space-x-1">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-600 dark:text-red-400">Passwords don't match</span>
                    </>
                  )}
                </div>
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-amethyst-200">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-rose-dust-600 dark:text-amethyst-400 font-medium hover:text-rose-dust-700 dark:hover:text-amethyst-300 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Terms Notice */}
          <div className="mt-6 p-4 bg-rose-dust-50 dark:bg-amethyst-800/50 rounded-lg">
            <p className="text-xs text-center text-gray-600 dark:text-amethyst-300">
              By creating an account, you agree to our community guidelines of respect, 
              kindness, and support for all members.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;