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

export const getUserById = async (userId: string) => {
  const response = await api.get(`/auth/${userId}`);
  return response.data;
}

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

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const updateProduct = async (product: Product) => {
  const response = await api.put<Product>(`/products/${product.id}`, product);
  return response.data;
}

export const getOrders = async () => {
  const response = await api.get<Order[]>('/orders');
  return response.data;
};

export const createOrder = async (order: { user_id: string; total_price: number }):Promise<Order> => {
  const response = await api.post<Order>('/orders', order);
  console.log("Order API Response:", response.data); // ✅ Debugging log
  return response.data;
};

export const getRecommendations = async () => {
  const response = await api.get<Recommendation[]>('/recommendations');
  return response.data;
};

export const updateRecommendation = async (category: string, product_id: string) => {
  const response = await api.post('/recommendations/update', { category, product_id });
  return response.data;
};

export const createReview = async (review: {
  product_id: string;
  rating: number;
  comment: string;
}) => {
  const response = await api.post<Review>('/reviews', review);
  return response.data;
};

export const getReviews = async (product_id: string) => {
  const response = await api.get<Review[]>(`/reviews/${product_id}`);
  return response.data;
};


// Add item to cart
export const addToCart = async (product_id: string, quantity: number) => {
  const response = await api.post('/cart', { product_id, quantity });
  return response.data;
};

// Get cart items
export const getCart = async () => {
  const response = await api.get<Product[]>('/cart');
  return response.data;
};

// Remove item from cart
export const removeFromCart = async (product_id: string) => {
  const response = await api.delete('/cart', { data: { product_id } });
  return response.data;
};

// Process payment
export const processPayment = async (
  order_id: number,
  payment_method: string,
  transaction_id: string
) => {
  const response = await api.post('/payments', { order_id, payment_method, transaction_id });
  return response.data;
};

// Get payment history
export const getPayments = async () => {
  const response = await api.get('/payments');
  return response.data;
};
