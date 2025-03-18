
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, loginUser, registerUser, RegisterData, UserCredentials } from '@/services/authService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: UserCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in via localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: UserCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const user = await loginUser(credentials);
      
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      } else {
        setError('Invalid email or password');
        return false;
      }
    } catch (error) {
      setError('An error occurred during login');
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const user = await registerUser(data);
      
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      } else {
        setError('Registration failed');
        return false;
      }
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        setError('Email already in use');
      } else {
        setError('An error occurred during registration');
      }
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
