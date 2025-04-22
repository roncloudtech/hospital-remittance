import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize state from localStorage
  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem('military_token');
    const user = JSON.parse(localStorage.getItem('user_data'));
    return { token, user };
  });

  const login = (token, user) => {
    // Store in localStorage
    localStorage.setItem('military_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    
    // Set axios defaults
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Update context state
    setAuthState({ token, user });
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('military_token');
    localStorage.removeItem('user_data');
    
    // Remove axios header
    delete axios.defaults.headers.common['Authorization'];
    
    // Reset state
    setAuthState({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{
      authToken: authState.token,
      user: authState.user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);