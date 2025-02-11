import { useEffect, useState } from "react";
import api from "../lib/api";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="p-4 bg-white shadow rounded">
            <h3 className="text-xl font-semibold">
              <Link href={`/product/${product.id}`}>{product.name}</Link>
            </h3>
            <p>{product.description}</p>
            <p className="font-bold">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
