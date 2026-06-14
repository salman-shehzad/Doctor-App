import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('doctorHubToken'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('doctorHubUser');
    return saved ? JSON.parse(saved) : null;
  });

  const login = ({ token: nextToken, user: nextUser }) => {
    localStorage.setItem('doctorHubToken', nextToken);
    localStorage.setItem('doctorHubUser', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem('doctorHubToken');
    localStorage.removeItem('doctorHubUser');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, isAuthenticated: Boolean(token), login, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
