/* eslint-disable jsx-a11y/alt-text */
"use client";
import { useEffect, useState, useRef } from 'react';
import { getSalesData, getUserRegistrations, getProductPerformance, getOrderStats, getRecommendationsData } from '@/lib/dashboard';
import { Bar, Line, Pie, Doughnut, Radar } from 'react-chartjs-2';
import 'chart.js/auto';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { toPng } from 'html-to-image';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 20 },
  heading: { fontSize: 18, marginBottom: 10 },
  heading1: { fontSize: 24, marginBottom
: 10 },
  text: { fontSize: 12 },
  image: { padding: 50  },
});

interface MyDocumentProps {
  salesData: { date: string; total: number }[];
  userRegistrations: { date: string; count: number }[];
  productPerformance: { productname: string; total_reviews: number; average_rating: string }[];
  orderStats: { status: string; count: number }[];
  recommendationsData: { category: string; total_recommendations: number }[];
  charts: {
    salesChart: string;
    userRegistrationsChart: string;
    productPerformanceChart: string;
    orderStatsChart: string;
    recommendationsChart: string;
    productRatingsChart: string;
  };
}

const MyDocument = ({ salesData, userRegistrations, productPerformance, orderStats, recommendationsData, charts }: MyDocumentProps) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
      <Text style={styles.heading1}>Admin Dashboard</Text>
        <Text style={styles.heading}>Sales Data</Text>
        <Image src={charts.salesChart} style={styles.image} />
        {salesData.map((data) => (
          <Text key={data.date} style={styles.text}>{`${data.date}: $${data.total}`}</Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>User Registrations</Text>
        <Image src={charts.userRegistrationsChart} style={styles.image} />
        {userRegistrations.map((data) => (
          <Text key={data.date} style={styles.text}>{`${data.date}: ${data.count} users`}</Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Product Performance</Text>
        <Image src={charts.productPerformanceChart} style={styles.image} />
        {productPerformance.map((data) => (
          <Text key={data.productname} style={styles.text}>{`${data.productname}: ${data.total_reviews} reviews, Average Rating: ${data.average_rating}`}</Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Order Status</Text>
        <Image src={charts.orderStatsChart} style={styles.image} />
        {orderStats.map((data) => (
          <Text key={data.status} style={styles.text}>{`${data.status}: ${data.count} orders`}</Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Recommendations</Text>
        <Image src={charts.recommendationsChart} style={styles.image} />
        {recommendationsData.map((data) => (
          <Text key={data.category} style={styles.text}>{`${data.category}: ${data.total_recommendations} recommendations`}</Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Product Ratings</Text>
        <Image src={charts.productRatingsChart} style={styles.image} />
      </View>
    </Page>
  </Document>
);

export default function DashboardPage() {
  const [salesData, setSalesData] = useState<{ date: string; total: number }[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<{ date: string; count: number }[]>([]);
  const [productPerformance, setProductPerformance] = useState<{ productname: string; total_reviews: number, average_rating: string }[]>([]);
  const [orderStats, setOrderStats] = useState<{ status: string; count: number }[]>([]);
  const [recommendationsData, setRecommendationsData] = useState<{ category: string; total_recommendations: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [charts, setCharts] = useState({
    salesChart: '',
    userRegistrationsChart: '',
    productPerformanceChart: '',
    orderStatsChart: '',
    recommendationsChart: '',
    productRatingsChart: '',
  });

  const salesChartRef = useRef<HTMLDivElement>(null);
  const userRegistrationsChartRef = useRef<HTMLDivElement>(null);
  const productPerformanceChartRef = useRef<HTMLDivElement>(null);
  const orderStatsChartRef = useRef<HTMLDivElement>(null);
  const recommendationsChartRef = useRef<HTMLDivElement>(null);
  const productRatingsChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      generateCharts();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateCharts = async () => {
    if (salesChartRef.current && userRegistrationsChartRef.current && productPerformanceChartRef.current && orderStatsChartRef.current && recommendationsChartRef.current && productRatingsChartRef.current) {
      const salesChart = await toPng(salesChartRef.current);
      const userRegistrationsChart = await toPng(userRegistrationsChartRef.current);
      const productPerformanceChart = await toPng(productPerformanceChartRef.current);
      const orderStatsChart = await toPng(orderStatsChartRef.current);
      const recommendationsChart = await toPng(recommendationsChartRef.current);
      const productRatingsChart = await toPng(productRatingsChartRef.current);

      setCharts({
        salesChart,
        userRegistrationsChart,
        productPerformanceChart,
        orderStatsChart,
        recommendationsChart,
        productRatingsChart,
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="right-0 mb-4 text-white">
        <PDFDownloadLink
          document={<MyDocument
            salesData={salesData}
            userRegistrations={userRegistrations}
            productPerformance={productPerformance}
            orderStats={orderStats}
            recommendationsData={recommendationsData}
            charts={charts}
          />}
          fileName="dashboard_report.pdf"
        >
          {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
        </PDFDownloadLink>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1>Admin E commerce Generated Data</h1>
          <h2 className="text-xl font-bold mb-4">Sales Data</h2>
          <div id="salesChart" ref={salesChartRef}>
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
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">User Registrations</h2>
          <div id="userRegistrationsChart" ref={userRegistrationsChartRef}>
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
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Product Performance</h2>
          <div id="productPerformanceChart" ref={productPerformanceChartRef}>
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
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Order Status</h2>
          <div id="orderStatsChart" ref={orderStatsChartRef}>
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
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Recommendations</h2>
          <div id="recommendationsChart" ref={recommendationsChartRef}>
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
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Product Ratings</h2>
          <div id="productRatingsChart" ref={productRatingsChartRef}>
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
    </div>
  );
}
