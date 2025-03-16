import { Recommendation } from "@/types";
import api from "./api";

export const getRecommendations = async () => {
    const response = await api.get<Recommendation[]>('/recommendations');
    return response.data;
  };
  
  export const updateRecommendation = async (category: string, product_id: string) => {
    const response = await api.post('/recommendations/update', { category, product_id });
    return response.data;
  };