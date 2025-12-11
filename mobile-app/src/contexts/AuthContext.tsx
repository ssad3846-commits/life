import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api';
import type { Member, LoginCredentials } from '../types';

interface AuthContextType {
  member: Member | null;
  memberId: number | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshMember: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const memberId = await AsyncStorage.getItem('memberId');
      if (memberId) {
        // Try to fetch member data with existing session cookie
        const memberData = await apiService.getMemberInfo();
        setMember(memberData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear memberId if session expired
      await AsyncStorage.removeItem('memberId');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiService.login(credentials);
      if (response.success && response.memberId) {
        // Store memberId locally for reference
        await AsyncStorage.setItem('memberId', response.memberId.toString());
        // Session cookie is automatically set by the backend
        // Fetch member data using the session cookie
        const memberData = await apiService.getMemberInfo();
        setMember(memberData);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setMember(null);
      await AsyncStorage.removeItem('memberId');
    }
  };

  const refreshMember = async () => {
    try {
      const memberData = await apiService.getMemberInfo();
      setMember(memberData);
    } catch (error) {
      console.error('Refresh member error:', error);
    }
  };

  const memberId = member?.id ?? null;
  const isLoggedIn = !!member;

  return (
    <AuthContext.Provider
      value={{
        member,
        memberId,
        isLoading,
        isAuthenticated: isLoggedIn,
        isLoggedIn,
        login,
        logout,
        refreshMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
