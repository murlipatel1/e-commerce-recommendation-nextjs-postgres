import { Order } from "@/types";
import api from "./api";

export const getOrders = async () => {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  };
  
  export const createOrder = async (order: { user_id: string; total_price: number }):Promise<Order> => {
    const response = await api.post<Order>('/orders', order);
    
    return response.data;
  };
  