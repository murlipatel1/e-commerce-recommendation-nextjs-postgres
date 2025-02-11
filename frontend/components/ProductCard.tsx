import { Product } from '@/types';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  onDelete?: (id: number) => void;
  isAdmin?: boolean;
}

export default function ProductCard({ product, onDelete, isAdmin }: ProductCardProps) {
  const router = useRouter();

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-lg font-bold">${product.price}</span>
        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => router.push(`/products/${product.id}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View Details
        </button>
        {isAdmin && onDelete && (
          <button
            onClick={() => onDelete(product.id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}