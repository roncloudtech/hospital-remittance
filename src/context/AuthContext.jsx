import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(() => {
    // Initialize from localStorage if available
    return localStorage.getItem('military_token');
  });

  const login = (token) => {
    localStorage.setItem('military_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem('military_token');
    delete axios.defaults.headers.common['Authorization'];
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);