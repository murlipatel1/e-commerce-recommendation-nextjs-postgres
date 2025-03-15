"use client";
import { useEffect, useState } from "react";
import { Order } from "@/types";
import { getOrders } from "@/lib/auth";
import { getPayments } from "@/lib/payment";
import OrderList from "@/components/OrderList";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<{ order_id: string; payment_method: string; transaction_id: string,
    shipping_name: string, shipping_address: string, shipping_city: string, shipping_state: string, shipping_zip: string, shipping_country: string
   }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    loadOrdersAndPayments();
  }, []);

  const loadOrdersAndPayments = async () => {
    try {
      const [ordersData, paymentsData] = await Promise.all([getOrders(), getPayments()]);
      setOrders(ordersData);
      setPayments(paymentsData);
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDate(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value || null);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearchTerm = order.id.toString().includes(searchTerm);
    const matchesSearchDate = searchDate
      ? new Date(order.created_at).toLocaleDateString() === new Date(searchDate).toLocaleDateString()
      : true;
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearchTerm && matchesSearchDate && matchesStatus;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Search by ID:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border rounded text-black"
            placeholder="Search orders..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Search by Date:</label>
          <input
            type="date"
            value={searchDate}
            onChange={handleDateChange}
            className="w-full px-3 py-2 border rounded text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Filter by Status:</label>
          <select
            value={statusFilter || ""}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 border rounded text-black"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      {filteredOrders.length > 0 ? (
        <OrderList orders={filteredOrders} payments={payments} />
      ) : (
        <div className="text-gray-900">No orders found.</div>
      )}
    </div>
  );
}