import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      
      // Get user profile
      getUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const getUserProfile = async () => {
    try {
      const response = await api.get('/auth/profile/');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login/', {
        username,
        password
      });

      const { user: userData, token: userToken } = response.data;
      
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('token', userToken);
      api.defaults.headers.common['Authorization'] = `Token ${userToken}`;

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data || 'Login failed' 
      };
    }
  };

  const register = async (username, password, confirmPassword, displayName) => {
    try {
      const response = await api.post('/auth/register/', {
        username,
        password,
        confirm_password: confirmPassword,
        display_name: displayName
      });

      const { user: userData, token: userToken } = response.data;
      
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('token', userToken);
      api.defaults.headers.common['Authorization'] = `Token ${userToken}`;

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile/update/', profileData);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        error: error.response?.data || 'Profile update failed' 
      };
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}