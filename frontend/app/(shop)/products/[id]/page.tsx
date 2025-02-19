"use client"
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product, Review } from '@/types';
import { getProductById, deleteProduct, updateProduct, getReviews } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import ReviewForm from '@/components/ReviewForm';

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
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
      loadReviews(id as string);
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

  const loadReviews = async (productId: string) => {
    try {
      const data = await getReviews(productId);
      setReviews(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
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

  const handleReviewSubmitted = () => {
    if (id) {
      loadReviews(id as string);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {product && (
        <>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h1 className="text-3xl font-bold mb-4 text-black ">{product.name}</h1>
            <p className="text-black mb-4">{product.description}</p>
            <p className="text-black font-semibold mb-2">Price: ${product.price}</p>
            <p className="text-black font-semibold mb-2">Stock: {product.stock}</p>
            <p className="text-black font-semibold mb-2">Category: {product.category}</p>
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
          </div>
        </>
      )}

      {isEditModalOpen && editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
                  className="bg-black text-white px-4 py-2 rounded hover:bg-black"
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

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {reviews.length > 0 ? (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center text-black">
                  <span className="font-semibold">{review.user_name}</span>
                  <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                </div>
                <p className="mt-2 text-black">{review.comment}</p>
                <p className="mt-2 text-sm text-black">{new Date(review.created_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-black">No reviews yet.</div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Add a Review</h2>
        <ReviewForm productId={id as string} onReviewSubmitted={handleReviewSubmitted} />
      </div>
    </div>
  );
}

