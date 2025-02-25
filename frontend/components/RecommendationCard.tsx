"use client"
import { getProductById } from '@/lib/auth';
import { Product, Recommendation } from '@/types';
import { useEffect, useState } from 'react';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (recommendation.product_id) {
      loadProduct(recommendation.product_id);
    }
  }, [recommendation.product_id]);

  const loadProduct = async (productId: string) => {
    try {
      const data = await getProductById(productId);
      setProduct(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {product && (
        <div>
          <h1 className="text-2xl font-bold mb-6">{product.name}</h1>
          <p className="mb-4">{product.description}</p>
          <p className="mb-4">Price: ${product.price}</p>
          <p className="mb-4">Stock: {product.stock}</p>
          <p className="mb-4">Category: {product.category}</p>
        </div>
      )}
    </div>
  );
}