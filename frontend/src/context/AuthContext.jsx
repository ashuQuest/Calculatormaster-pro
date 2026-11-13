import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cmpro_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const token = localStorage.getItem('cmpro_access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await authApi.getProfile();
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('cmpro_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      // If unauthorized, clear tokens
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (username_or_email, password) => {
    const res = await authApi.login({ username_or_email, password });
    if (res.data.success) {
      const { user: userData, tokens } = res.data;
      localStorage.setItem('cmpro_access_token', tokens.access);
      localStorage.setItem('cmpro_refresh_token', tokens.refresh);
      localStorage.setItem('cmpro_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await authApi.register(formData);
    if (res.data.success) {
      const { user: userData, tokens } = res.data;
      localStorage.setItem('cmpro_access_token', tokens.access);
      localStorage.setItem('cmpro_refresh_token', tokens.refresh);
      localStorage.setItem('cmpro_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('cmpro_access_token');
    localStorage.removeItem('cmpro_refresh_token');
    localStorage.removeItem('cmpro_user');
    setUser(null);
  };

  const isSuperadmin = Boolean(user?.is_superadmin || user?.role === 'SUPERADMIN');
  const hasPremium = Boolean(user?.has_premium || isSuperadmin);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        isSuperadmin,
        hasPremium,
        login,
        register,
        logout,
        refreshUserProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
