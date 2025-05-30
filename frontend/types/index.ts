import { ReactNode } from "react";

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    photo_url: string;
  }
  
  export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
  }
  
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: string;
  }
  
  export interface LoginData {
    email: string;
    password: string;
  }

  export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    photo_url: string;
  }

  export interface Order {
    id: string;
    user_id: number;
    total_price: number;
    status: 'pending' | 'delivered' | 'cancelled'| 'shipped';
    created_at: string;
  }

  export interface Recommendation {
    id: number;
    user_id: number;
    product_id: string;
    product: Product;
    score: number;
    created_at: string;
    category: string;
  }
  
  export interface Review {
    user_name: ReactNode;
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    comment: string;
    created_at: string;
    user?: {
      name: string;
    };
  }