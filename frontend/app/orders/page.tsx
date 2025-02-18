"use client"
import { useEffect, useState } from 'react';
import { Order } from '@/types';
import { getOrders } from '@/lib/auth';
import OrderList from '@/components/OrderList';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
      
    } catch (err) {
      if (err instanceof Error) {
      setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      {orders.length> 0 ? (<OrderList orders={orders} />
    ) : (
      <div className="text-gray-500">No orders found.</div>
    )}
    </div>
  );
}