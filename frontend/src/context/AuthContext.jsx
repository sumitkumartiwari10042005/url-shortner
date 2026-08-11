import { createContext, useContext, useState, useEffect } from 'react';
import api, { setAccessToken, getAccessToken } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  
  useEffect(() => {
    const tryRestoreSession = async () => {
      try {
        const { data } = await api.post('/api/auth/refresh-token');
        setAccessToken(data.accessToken);
       
        setUser({ authenticated: true });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    tryRestoreSession();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  };

  const register = async (username, email, password) => {
    const { data } = await api.post('/api/auth/register', { username, email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
    
    }
    setAccessToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
