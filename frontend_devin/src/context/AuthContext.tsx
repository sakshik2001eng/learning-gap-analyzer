import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type Role = 'student' | 'teacher';

export interface User {
  email: string;
  name: string;
  role: Role;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: Role) => void;
  signup: (email: string, password: string, name: string, role: Role) => void;
  logout: () => void;
}

const STORAGE_KEY = 'lga.session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Read the saved session synchronously so protected routes don't redirect
// a logged-in user to /login on a page refresh.
const readSession = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const titleCase = (text: string) =>
  text.replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(readSession);

  const saveSession = (next: User) => {
    setUser(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  // Frontend-only demo auth: any non-empty credentials are accepted.
  // Replace these bodies with real API calls when the backend exists.
  const login = useCallback((email: string, _password: string, role: Role) => {
    const local = email.split('@')[0] || 'user';
    const base = titleCase(local);
    const name = role === 'teacher' ? `Dr. ${base}` : base;
    saveSession({ email, name, role, avatar: initials(name) });
  }, []);

  const signup = useCallback((email: string, _password: string, name: string, role: Role) => {
    saveSession({ email, name, role, avatar: initials(name) });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, signup, logout }),
    [user, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
