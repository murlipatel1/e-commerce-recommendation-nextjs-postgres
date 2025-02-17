"use client"
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types';
import { getProductById, deleteProduct, updateProduct } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const { user } = useAuth();
  const params = useParams();
  const id = params ? params.id : null;
  const router = useRouter();

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

  const handleDelete = async () => {
    if (product) {
      try {
        await deleteProduct(product.id);
        router.push('/products');
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }
    }
  };

  const handleEdit = () => {
    if (product) {
      setEditProduct(product);
      setIsEditModalOpen(true);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editProduct) {
      setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editProduct) {
      try {
        await updateProduct(editProduct);
        setProduct(editProduct);
        setIsEditModalOpen(false);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {product && (
        <>
          <h1 className="text-2xl font-bold mb-6">{product.name}</h1>
          <p className="mb-4">{product.description}</p>
          <p className="mb-4">Price: ${product.price}</p>
          <p className="mb-4">Stock: {product.stock}</p>
          <p className="mb-4">Category: {product.category}</p>
          {user?.role === 'admin' && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}

      {isEditModalOpen && editProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-black">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editProduct.name}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={editProduct.description}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editProduct.price}
                  step="0.01"
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={editProduct.stock}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  name="category"
                  value={editProduct.category}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded text-black"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

