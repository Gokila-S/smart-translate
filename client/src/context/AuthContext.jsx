import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext({ user: null, token: null, login: async () => {}, logout: () => {} });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (e) {
      console.error("Failed to load auth data from localStorage", e);
    }
    setLoading(false);
  }, []);

  const persist = (u, t) => {
    if (!u && !t) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } else {
      localStorage.setItem('user', JSON.stringify(u));
      localStorage.setItem('token', t);
    }
  };

  const login = useCallback(async (email, password) => {
    try {
  const { data } = await axios.post('https://smart-translate-yb08.onrender.com/api/auth/login', { email, password });
      setUser(data.user);
      setToken(data.token);
      persist(data.user, data.token);
      return data.user;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    persist(null, null);
  }, []);

  const value = useMemo(() => ({ user, token, login, logout }), [user, token, login, logout]);
  if (loading) return null;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;