import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

import { API_BASE_URL } from '../config/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('civicpulse_user') || sessionStorage.getItem('civicpulse_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) { /* ignore */ }
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('civicpulse_token') || sessionStorage.getItem('civicpulse_token') || null;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to store tokens and user info
  const saveAuth = (newToken, newUser, rememberMe = true) => {
    setToken(newToken);
    setUser(newUser);
    if (rememberMe) {
      localStorage.setItem('civicpulse_token', newToken);
      localStorage.setItem('civicpulse_user', JSON.stringify(newUser));
      sessionStorage.removeItem('civicpulse_token');
      sessionStorage.removeItem('civicpulse_user');
    } else {
      sessionStorage.setItem('civicpulse_token', newToken);
      sessionStorage.setItem('civicpulse_user', JSON.stringify(newUser));
      localStorage.removeItem('civicpulse_token');
      localStorage.removeItem('civicpulse_user');
    }
  };

  const clearToken = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('civicpulse_token');
    sessionStorage.removeItem('civicpulse_token');
    localStorage.removeItem('civicpulse_user');
    sessionStorage.removeItem('civicpulse_user');
  }, []);

  // Check current authenticated user on load
  const checkAuth = useCallback(async () => {
    const currentToken = localStorage.getItem('civicpulse_token') || sessionStorage.getItem('civicpulse_token');
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    // Mock/demo tokens don't need backend validation
    if (currentToken.startsWith('mock-')) {
      const savedUser = localStorage.getItem('civicpulse_user') || sessionStorage.getItem('civicpulse_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          clearToken();
        }
      } else {
        clearToken();
      }
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
        if (localStorage.getItem('civicpulse_token')) {
          localStorage.setItem('civicpulse_user', JSON.stringify(data.user));
        } else {
          sessionStorage.setItem('civicpulse_user', JSON.stringify(data.user));
        }
      } else {
        // Token invalid or expired
        clearToken();
      }
    } catch (err) {
      // Backend offline or unreachable: keep saved user session active if present
      const savedUser = localStorage.getItem('civicpulse_user') || sessionStorage.getItem('civicpulse_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          clearToken();
        }
      } else {
        clearToken();
      }
    } finally {
      setLoading(false);
    }
  }, [clearToken]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (email, password, rememberMe = false) => {
    setError(null);
    setLoading(true);

    const lowerEmail = (email || '').toLowerCase().trim();

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

      saveAuth(data.token, data.user, rememberMe);
      setLoading(false);
      return data.user;
    } catch (err) {
      const isNetworkError = err.name === 'TypeError' && err.message.includes('fetch');
      // Offline / demo fallback only when backend server is completely unreachable
      if (isNetworkError) {
        if (lowerEmail === 'aryan@civicpulse.gov.in' || lowerEmail === 'citizen@civicpulse.gov.in' || lowerEmail === 'citizen@example.com') {
          const demoUser = {
            id: 'CIT-001',
            name: 'Aryan Juneja',
            email: lowerEmail,
            role: 'citizen',
            location: 'Model Town, Sector 4'
          };
          saveAuth('mock-citizen-token', demoUser, rememberMe);
          setLoading(false);
          return demoUser;
        } else if (lowerEmail === 'officer@civicpulse.gov.in' || lowerEmail === 'officer@gov.org') {
          const demoUser = {
            id: 'OFF-101',
            name: 'Rajesh Kumar',
            email: lowerEmail,
            role: 'officer',
            department: 'Public Works Department (PWD)'
          };
          saveAuth('mock-officer-token', demoUser, rememberMe);
          setLoading(false);
          return demoUser;
        } else if (lowerEmail === 'supervisor@civicpulse.gov.in' || lowerEmail === 'supervisor@gov.org') {
          const demoUser = {
            id: 'SUP-201',
            name: 'Anita Sharma',
            email: lowerEmail,
            role: 'supervisor',
            department: 'Municipal Administration'
          };
          saveAuth('mock-supervisor-token', demoUser, rememberMe);
          setLoading(false);
          return demoUser;
        }
      }

      setLoading(false);
      const msg = isNetworkError
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

      saveAuth(data.token, data.user, true);
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
    setLoading(true);
    try {
      const currentToken = token || localStorage.getItem('civicpulse_token') || sessionStorage.getItem('civicpulse_token');
      if (currentToken && !currentToken.startsWith('mock-')) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`
          }
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearToken();
      setLoading(false);
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
