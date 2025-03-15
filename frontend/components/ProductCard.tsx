import { Product } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product; 
  onAddToCart?: (product: Product) => void;
  onClick?: () => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onClick,
}: ProductCardProps) {
  const router = useRouter();

  return (
    <div className="border rounded-lg p-3 shadow-sm place-items-center flex" onClick={onClick}>
      <div>
      <Image
        src={product.photo_url}
        alt={product.name}
        className=" object-cover rounded-lg p-3"
        width={250}
        height={250}
      />
      </div>
      <div>
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-lg font-bold ">${product.price}</span>
        
        <span className="text-sm text-gray-500 pr-4">Stock: {product.stock}</span>
      </div>
      <div className="mt-4 flex gap-2 bottom-0 text-xs items-center">
        <button
          onClick={() => router.push(`/products/${product.id}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View Details
        </button>
        
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add to Cart
          </button>
        )}
      </div>
      </div>
    </div>
  );
}
