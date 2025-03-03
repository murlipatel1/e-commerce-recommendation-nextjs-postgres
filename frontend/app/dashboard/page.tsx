"use client";
import { useEffect, useState } from 'react';
import { getSalesData, getUserRegistrations, getProductPerformance, getOrderStats, getRecommendationsData } from '@/lib/admin';
import { Bar, Line, Pie, Doughnut, Radar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function DashboardPage() {
  const [salesData, setSalesData] = useState<{ date: string; total: number }[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<{ date: string; count: number }[]>([]);
  const [productPerformance, setProductPerformance] = useState<{ productname: string; total_reviews: number,average_rating:string }[]>([]);
  const [orderStats, setOrderStats] = useState<{ status: string; count: number }[]>([]);
  const [recommendationsData, setRecommendationsData] = useState<{ category: string; total_recommendations: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const sales = await getSalesData();
      const users = await getUserRegistrations();
      const products = await getProductPerformance();
      const orders = await getOrderStats();
      const recommendations = await getRecommendationsData();
      setSalesData(sales);
      setUserRegistrations(users);
      setProductPerformance(products);
      setOrderStats(orders);
      setRecommendationsData(recommendations);
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
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Sales Data</h2>
          <Bar
            data={{
              labels: salesData.map((data) => data.date),
              datasets: [
                {
                  label: 'Sales',
                  data: salesData.map((data) => data.total),
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
              ],
            }}
          />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">User Registrations</h2>
          <Line
            data={{
              labels: userRegistrations.map((data) => data.date),
              datasets: [
                {
                  label: 'Registrations',
                  data: userRegistrations.map((data) => data.count),
                  backgroundColor: 'rgba(153, 102, 255, 0.6)',
                },
              ],
            }}
          />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Product Performance</h2>
          <Pie
            data={{
              labels: productPerformance.map((data) => data.productname),
              datasets: [
                {
                  label: 'Performance',
                  data: productPerformance.map((data) => data.total_reviews),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                  ],
                },
              ],
            }}
          />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Order Status</h2>
          <Doughnut
            data={{
              labels: orderStats.map((data) => data.status),
              datasets: [
                {
                  label: 'Orders',
                  data: orderStats.map((data) => data.count),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                  ],
                },
              ],
            }}
          />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Recommendations</h2>
          <Bar
            data={{
              labels: recommendationsData.map((data) => data.category),
              datasets: [
                {
                  label: 'Recommendations',
                  data: recommendationsData.map((data) => data.total_recommendations),
                  backgroundColor: 'rgba(255, 159, 64, 0.6)',
                },
              ],
            }}
          />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Product Ratings</h2>
          <Radar
            data={{
              labels: productPerformance.map((data) => data.productname),
              datasets: [
                {
                  label: 'Average Rating',
                  data: productPerformance.map((data) => parseFloat(data.average_rating) || 0),
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 2,
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}
