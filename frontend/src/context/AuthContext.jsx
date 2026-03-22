import { createContext, useState, useEffect, useContext } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/users/me');
          if (response.data.success) {
            setUser(response.data.data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error("Auth init error:", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        
        const meResponse = await api.get('/users/me');
        setUser(meResponse.data.data);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Invalid credentials" };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      if (response.data.success) {
        return await login(email, password);
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  const refreshUser = async () => {
     try {
        const response = await api.get('/users/me');
        if (response.data.success) {
           setUser(response.data.data);
        }
     } catch (err) {
        console.error("Error refreshing user", err);
     }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
