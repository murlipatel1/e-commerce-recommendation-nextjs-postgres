import { Review } from "@/types";
import api from "./api";

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
  