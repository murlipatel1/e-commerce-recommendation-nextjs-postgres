import api from './api';

export const getSalesData = async () => {
  const response = await api.get('/admin/sales');
  return response.data;
};

export const getUserRegistrations = async () => {
  const response = await api.get('/admin/registrations');
  return response.data;
};

export const getProductPerformance = async () => {
  const response = await api.get('/admin/product-performance');
  console.log("product performance", response.data);
  return response.data;
};

export const getOrderStats = async () => {
    const response = await api.get('/admin/order-stats');
    return response.data;
  };
  
  export const getRecommendationsData = async () => {
    const response = await api.get('/admin/recommendations');
    return response.data;
  };
  