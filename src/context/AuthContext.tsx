import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService, User } from '../services/authService';
import FCMService from '../services/FCMService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (nohp: string, otp_code: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();

    // Setup real-time listener for verification status
    const unsubscribe = FCMService.addMessageListener((remoteMessage) => {
      const type = remoteMessage?.data?.type;
      if (type === 'user_verification') {
        console.log('Verification update received, refreshing user data...');
        refreshUser();
      }
    });

    return () => unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      if (authenticated) {
        const userData = await authService.getProfile();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      console.log('Auth check failed:', error);
      if (error.response?.status === 401) {
        await authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (nohp: string, otp_code: string) => {
    const response = await authService.verifyOTP(nohp, otp_code);
    if (!response.data.needs_profile) {
      setUser(response.data.user);
      setIsAuthenticated(true);
    }
    await FCMService.initialize();
    return response;
  };

  const logout = async () => {
    await FCMService.deleteToken();
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.log('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
