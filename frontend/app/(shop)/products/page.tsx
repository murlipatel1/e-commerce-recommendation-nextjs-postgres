"use client";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { getProducts } from "@/lib/product";
import { createOrder } from "@/lib/order";
import { updateRecommendation } from "@/lib/recommendation";
import { fetchCart, addToCart, removeFromCart, clearCart } from "@/lib/cart";
import ProductCard from "@/components/ProductCard";
import CartModal from "@/components/CartModal";
import { useAuth } from "@/contexts/AuthContext";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useRouter } from "next/navigation"; // Import useRouter

export default function ProductsPage() {
  const router = useRouter(); // Initialize router
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState<{ id: string; product_id: string; name: string; price: number; quantity: number; photo_url: string; total_price: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const { user } = useAuth();

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  // Fetch products
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

  // Fetch cart from backend
  const loadCart = async () => {
    try {
      const cartItems = await fetchCart();
      setCart(cartItems);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  // Add item to cart (API call)
  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
      await loadCart(); // Refresh cart from backend
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  // Remove item from cart (API call)
  const handleRemoveFromCart = async (productId: string) => {
    try {
     
      await removeFromCart(productId);
      await loadCart(); // Refresh cart from backend
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const toggleCartModal = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please log in to place an order.");
      return;
    }

    const total_price = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total_price_final=(total_price*1.12).toFixed(2);

    try {
      const orderResponse= await createOrder({ user_id: user.id, total_price: total_price * 1.12 });
      
      await clearCart(); // Clear cart from frontend
      await loadCart(); // Clear cart from backend
      toggleCartModal();
      alert("Order placed successfully!");
      const order_id = orderResponse.id;
      router.push(`/payment?order_id=${order_id}&total_price=${total_price_final}`); 
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleProductClick = async (category: string, product_id: string) => {
    try {
      await updateRecommendation(category, product_id);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceRangeChange = (value: number | number[]) => {
    if (Array.isArray(value) && value.length === 2) {
      setPriceRange([value[0], value[1]]);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesSearchTerm && matchesPriceRange;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 bg-white text-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="mb-4 flex justify-between items-center">
        <span className="text-lg font-semibold">
          Cart: {cart.reduce((acc, item) => acc + item.quantity, 0)} items
        </span>
        <button onClick={toggleCartModal} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          View Cart
        </button>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Filter by Category:</label>
          <select
            value={selectedCategory || ""}
            onChange={(e) => handleCategoryChange(e.target.value || null)}
            className="w-full px-3 py-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="">All Categories</option>
            {[...new Set(products.map((product) => product.category))].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4 ">
          <label className="block text-sm font-medium mb-2">Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Search products..."
          />
        </div>
        <div className="mb-4 ">
          <label className="block text-sm font-medium mb-2">Price Range:</label>
          <Slider
            range
            min={0}
            max={1000}
            defaultValue={[0, 1000]}
            value={priceRange}
            onChange={handlePriceRangeChange}
            className="mb-4"
            trackStyle={[{ backgroundColor: '#3b82f6' }]}
            handleStyle={[
              { borderColor: '#3b82f6', backgroundColor: '#fff' },
              { borderColor: '#3b82f6', backgroundColor: '#fff' }
            ]}
            railStyle={{ backgroundColor: '#e5e7eb' }}
          />
          <div className="flex justify-between text-sm text-gray-700 ">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => handleAddToCart(product)}
            onClick={() => handleProductClick(product.category, product.id)}
          />
        ))}
      </div>
      {isCartOpen && <CartModal cart={cart} onClose={toggleCartModal} onDelete={handleRemoveFromCart} onPlaceOrder={handlePlaceOrder} />}
    </div>
  );
}
