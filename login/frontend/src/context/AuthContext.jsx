import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const defaultMockCitizen = {
  id: 'CIT-001',
  name: 'Aryan',
  email: 'aryan@civicpulse.gov.in',
  role: 'citizen',
  location: 'Model Town, Sector 4'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // In local mock mode, default to mock citizen user so citizen workspace routes function smoothly without backend
    const savedUser = localStorage.getItem('civicpulse_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) { /* ignore */ }
    }
    return defaultMockCitizen;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('civicpulse_token') || sessionStorage.getItem('civicpulse_token') || 'mock-citizen-token';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to store/clear tokens
  const saveToken = (newToken, rememberMe = true) => {
    setToken(newToken);
    if (rememberMe) {
      localStorage.setItem('civicpulse_token', newToken);
      sessionStorage.removeItem('civicpulse_token');
    } else {
      sessionStorage.setItem('civicpulse_token', newToken);
      localStorage.removeItem('civicpulse_token');
    }
  };

  const clearToken = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('civicpulse_token');
    sessionStorage.removeItem('civicpulse_token');
    localStorage.removeItem('civicpulse_user');
  }, []);

  // Check current authenticated user on load
  const checkAuth = useCallback(async () => {
    const currentToken = token || localStorage.getItem('civicpulse_token') || sessionStorage.getItem('civicpulse_token');
    if (!currentToken || currentToken === 'mock-citizen-token') {
      if (!user) setUser(defaultMockCitizen);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
      } else {
        // In local mode without active backend, fall back to mock citizen
        setUser(defaultMockCitizen);
      }
    } catch (err) {
      // Backend offline: gracefully keep mock citizen active for frontend development
      setUser(defaultMockCitizen);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (email, password, rememberMe = false) => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      saveToken(data.token, rememberMe);
      setUser(data.user);
      setLoading(false);
      return data.user;
    } catch (err) {
      setLoading(false);
      const msg = err.name === 'TypeError' && err.message.includes('fetch')
        ? 'Unable to reach CivicPulse server. Please check your internet connection or server status.'
        : err.message || 'Login failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Citizen Registration handler
  const register = async (userData) => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed.');
      }

      saveToken(data.token, true);
      setUser(data.user);
      setLoading(false);
      return data.user;
    } catch (err) {
      setLoading(false);
      const msg = err.name === 'TypeError' && err.message.includes('fetch')
        ? 'Unable to reach CivicPulse server. Please check your internet connection or server status.'
        : err.message || 'Registration failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearToken();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
