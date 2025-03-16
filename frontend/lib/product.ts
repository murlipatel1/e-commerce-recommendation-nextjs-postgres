import { Product } from "@/types";
import api from "./api";

export const getProducts = async () => {
    const response = await api.get<Product[]>('/products');
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
  
  export const createProduct = async (product:FormData) => {
    const response = await api.post<Product>('/products', product,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  };
  
  export const deleteProduct = async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  };
  
  export const updateProduct = async (product: Product) => {
    const response = await api.put<Product>(`/products/${product.id}`, product);
    return response.data;
  }
  