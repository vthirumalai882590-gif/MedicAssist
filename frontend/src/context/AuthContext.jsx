import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('MEDIASSIST_USER');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (role, mobileNumber) => {
    const userObj = {
      role, // 'doctor' | 'patient'
      mobileNumber,
      loginTime: new Date().toISOString(),
      token: 'demo-jwt-token-' + Math.random().toString(36).substr(2, 9)
    };
    setUser(userObj);
    localStorage.setItem('MEDIASSIST_USER', JSON.stringify(userObj));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('MEDIASSIST_USER');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
