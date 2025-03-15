import api from "./api";

export type CartItem = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  photo_url: string;
  quantity: number;
  total_price: number;
};

// Fetch cart items from the backend
export const fetchCart = async (): Promise<CartItem[]> => {
  const response = await api.get<CartItem[]>("/cart");
  return response.data;
};

// Add item to cart
export const addToCart = async (product_id: string, quantity: number): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/cart", { product_id, quantity });
  return response.data;
};

export const removeFromCart = async (product_id: string): Promise<{ message: string }> => {
    try {
      const response = await api.delete(`/cart?product_id=${product_id}`);
      return response.data;
    } catch (error) {
      console.error("Error removing item from cart:", error);
      throw error;
    }
  };
  
  

// Clear the entire cart
export const clearCart = async (): Promise<{ message: string }> => {
  try {
    const response = await api.delete("/cart/clear");
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};
