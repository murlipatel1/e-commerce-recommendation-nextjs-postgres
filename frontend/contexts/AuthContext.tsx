'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as auth from '@/lib/auth';
import { AuthResponse, LoginData, RegisterData } from '@/types';
import Cookies from 'js-cookie';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for stored user data
    const storedUser = sessionStorage.getItem('user');
    const accessToken = Cookies.get('accessToken');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      
    } else if (accessToken) {
      const userInfo = parseJwt(accessToken);
      setUser(userInfo);
      sessionStorage.setItem('user', JSON.stringify(userInfo));
      
    } else {
      
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
      await auth.register(data);
      // handleAuthResponse(response);
      router.push('/products');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const handleAuthResponse = (response: AuthResponse) => {
    const { accessToken, refreshToken } = response;
    Cookies.set('accessToken', accessToken,{secure:false});
    Cookies.set('refreshToken', refreshToken, {secure:false});
    
    // Decode the JWT to get user info
    const userInfo = parseJwt(accessToken);
    setUser(userInfo);
    sessionStorage.setItem('user', JSON.stringify(userInfo));
    
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

// Helper function to parse JWT
function parseJwt(token: string): User {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT:', e);
    
    return {id: 0,name: "",email: "",role: ""};
  }
}

