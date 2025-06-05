import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/auth.service';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await AuthService.getCurrentUser();
          setCurrentUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await AuthService.login(email, password);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.error('Login error in context:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await AuthService.register(userData);
      return response;
    } catch (error) {
      console.error('Registration error in context:', error);
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (userId, userData) => {
    try {
      const response = await AuthService.updateProfile(userId, userData);
      if (currentUser && currentUser._id === userId) {
        setCurrentUser({...currentUser, ...userData});
      }
      return response;
    } catch (error) {
      console.error('Update profile error in context:', error);
      throw error;
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const response = await AuthService.requestPasswordReset(email);
      return response;
    } catch (error) {
      console.error('Password reset request error in context:', error);
      throw error;
    }
  };

  const verifyResetToken = async (token) => {
    try {
      const response = await AuthService.verifyResetToken(token);
      return response;
    } catch (error) {
      console.error('Token verification error in context:', error);
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await AuthService.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      console.error('Password reset error in context:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    requestPasswordReset,
    verifyResetToken,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
