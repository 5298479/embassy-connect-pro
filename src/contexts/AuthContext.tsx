
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, loginUser, registerUser, RegisterData, UserCredentials } from '@/services/authService';

interface AuthContextType {
  currentUser: User | null;
  user: User | null; // alias for currentUser
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
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: UserCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      console.log("Attempting login for:", credentials.email);
      const user = await loginUser(credentials);
      
      if (user) {
        console.log("Login successful");
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      } else {
        console.log("Login failed");
        setError('Invalid email or password');
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setError('An error occurred during login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      console.log("Attempting registration for:", data.email);
      const user = await registerUser(data);
      
      if (user) {
        console.log("Registration successful");
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      } else {
        console.log("Registration failed");
        setError('Registration failed');
        return false;
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.code === 'ER_DUP_ENTRY') {
        setError('Email already in use');
      } else {
        setError('An error occurred during registration');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("Logging out");
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    currentUser, 
    user: currentUser, // alias for compatibility
    loading, 
    error, 
    login, 
    register, 
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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
