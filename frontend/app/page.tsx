"use client"
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
    console.log('Current user:', user);
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome to the E-Commerce Platform</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/products">
          <div className="block p-4 border rounded hover:bg-gray-100">Products</div>
        </Link>
        <Link href="/recommendations">
          <div className="block p-4 border rounded hover:bg-gray-100">Recommendations</div>
        </Link>
        <Link href="/orders">
          <div className="block p-4 border rounded hover:bg-gray-100">My Orders</div>
        </Link>
        <Link href="/products/new">
          <div className="block p-4 border rounded hover:bg-gray-100">Add New Product</div>
        </Link>
        <Link href="/login">
          <div className="block p-4 border rounded hover:bg-gray-100">Login</div>
        </Link>
        <Link href="/register">
          <div className="block p-4 border rounded hover:bg-gray-100">Register</div>
        </Link>
      </div>
    </div>
  );
}
