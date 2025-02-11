// pages/products/[id].tsx
"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/types';
import { getProductById } from '@/lib/auth';

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // const router = useRouter();
  const params = useParams();
  const id = params ? params.id : null;

  useEffect(() => {
    if (id) {
      loadProduct(id as string);
    }
  }, [id]);

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
    <div className="container mx-auto px-4 py-8">
      {product && (
        <>
          <h1 className="text-2xl font-bold mb-6">{product.name}</h1>
          <p className="mb-4">{product.description}</p>
          <p className="mb-4">Price: ${product.price}</p>
          <p className="mb-4">Stock: {product.stock}</p>
          <p className="mb-4">Category: {product.category}</p>
        </>
      )}
    </div>
  );
}

