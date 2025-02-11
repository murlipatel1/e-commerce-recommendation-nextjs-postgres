// src/contexts/AuthContext.tsx
"use client"
// import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as auth from '@/lib/auth';
import { AuthResponse, LoginData, RegisterData } from '@/types';
import Cookies from 'js-cookie';

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
// }

interface AuthContextType {
  user: string | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for stored user data
    const storedUser = sessionStorage.getItem('user');
    const accessToken = Cookies.get('accessToken');
    console.log(storedUser)
    console.log(accessToken)
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log('User loaded from session storage:', JSON.parse(storedUser));
    } else if (accessToken) {
      const userInfo = accessToken;
      setUser(userInfo);
      sessionStorage.setItem('user', JSON.stringify(userInfo));
      console.log('User info set and stored in session storage from accessToken:', userInfo);
    } else {
      console.log('No user found in session storage or accessToken');
    }
  }, []);

  const handleLogin = async (data: LoginData) => {
    try {
      const response = await auth.login(data);
      handleAuthResponse(response);
      router.push('/products');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
      sessionStorage.removeItem('user');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const handleRegister = async (data: RegisterData) => {
    try {
      const response = await auth.register(data);
      handleAuthResponse(response);
      router.push('/products');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const handleAuthResponse = (response: AuthResponse) => {
    const { accessToken, refreshToken } = response;
    Cookies.set('accessToken', accessToken);
    Cookies.set('refreshToken', refreshToken);
    
    // Decode the JWT to get user info
    const userInfo = accessToken;
    setUser(userInfo);
    sessionStorage.setItem('user', JSON.stringify(userInfo));
    console.log('User info set and stored in session storage:', userInfo);
  };

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout, register: handleRegister }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

