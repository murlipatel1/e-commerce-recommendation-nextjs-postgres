"use client"
import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { getProducts, createOrder } from '@/lib/auth';
import ProductCard from '@/components/ProductCard';
import CartModal from '@/components/CartModal';
import { useAuth } from '@/contexts/AuthContext';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.product.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const deleteFromCart = (productId: number) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.product.id === productId);
      if (existingProduct && existingProduct.quantity > 1) {
        return prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prevCart.filter((item) => item.product.id !== productId);
      }
    });
  };

  const toggleCartModal = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Please log in to place an order.');
      return;
    }

    const total_price = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    try {
      await createOrder({ user_id: user.id, total_price });
      setCart([]);
      toggleCartModal();
      alert('Order placed successfully!');
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="mb-4 flex justify-between items-center">
        <span className="text-lg font-semibold">Cart: {cart.reduce((acc, item) => acc + item.quantity, 0)} items</span>
        <button
          onClick={toggleCartModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View Cart
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
      {isCartOpen && (
        <CartModal
          cart={cart}
          onClose={toggleCartModal}
          onDelete={deleteFromCart}
          onPlaceOrder={handlePlaceOrder}
        />
      )}
    </div>
  );
}
