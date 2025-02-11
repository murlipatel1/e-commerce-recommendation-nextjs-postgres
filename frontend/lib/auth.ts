// lib/auth.ts
import api from './api';
import { AuthResponse, LoginData, Order, Product, Recommendation, RegisterData, Review } from '@/types';


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


export const getProducts = async () => {
    const response = await api.get<Product[]>('/products');
    console.log(response.data);
    return response.data;
  };
  
  export const getProduct = async (id: number) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  };

  export const getProductById = async (id: string) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  };
  
  export const createProduct = async (product: Omit<Product, 'id'>) => {
    const response = await api.post<Product>('/products', product);
    return response.data;
  };
  
  export const deleteProduct = async (id: number) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  };
  
  export const getOrders = async () => {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  };
  
  export const createOrder = async (order: { user_id: number; total_price: number }) => {
    const response = await api.post<Order>('/orders', order);
    return response.data;
  };
  

  export const getRecommendations = async () => {
    const response = await api.get<Recommendation[]>('/recommendations');
    return response.data;
  };
  
  export const createReview = async (review: {
    product_id: number;
    rating: number;
    comment: string;
  }) => {
    const response = await api.post<Review>('/reviews', review);
    return response.data;
  };