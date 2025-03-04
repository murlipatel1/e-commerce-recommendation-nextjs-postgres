import api from './api';

export const getSalesData = async () => {
  const response = await api.get('/dashboard/sales');
  return response.data;
};

export const getUserRegistrations = async () => {
  const response = await api.get('/dashboard/registrations');
  return response.data;
};

export const getProductPerformance = async () => {
  const response = await api.get('/dashboard/product-performance');
  console.log("product performance", response.data);
  return response.data;
};

export const getOrderStats = async () => {
    const response = await api.get('/dashboard/order-stats');
    return response.data;
  };
  
  export const getRecommendationsData = async () => {
    const response = await api.get('/dashboard/recommendations');
    return response.data;
  };
  