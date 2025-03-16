import api from './api';
import { AuthResponse, LoginData, RegisterData } from '@/types';

export const register = async (data: RegisterData) => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const refreshToken = async (token: string) => {
  const response = await api.post<{ accessToken: string }>('/auth/refresh', { refreshToken: token });
  return response.data;
};

export const getUserById = async (userId: string) => {
  const response = await api.get(`/auth/${userId}`);
  return response.data;
}
