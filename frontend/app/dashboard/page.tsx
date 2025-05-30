/* eslint-disable jsx-a11y/alt-text */
"use client";
import { useEffect, useState, useRef } from 'react';
import { getSalesData, getUserRegistrations, getProductPerformance, getOrderStats, getRecommendationsData } from '@/lib/dashboard';
import { Bar, Line, Pie, Doughnut, Radar } from 'react-chartjs-2';
import 'chart.js/auto';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { toPng } from 'html-to-image';

const styles = StyleSheet.create({
  page: { padding: 30, position: 'relative' },
  watermark: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    fontSize: 60,
    color: 'rgba(150,150,150,0.3)',
    transform: 'rotate(-45deg)',
  },
  section: { marginBottom: 20, paddingBottom: 10, borderBottom: '1 solid #ccc' },
  heading: { fontSize: 18, marginBottom: 10 },
  text: { fontSize: 12 },
  chartImage: { marginVertical: 10, width: '100%', height: 250 },
  table: {width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', marginTop: 10 },
  tableRow: { flexDirection: 'row' },
  tableColHeader: { width: '50%', borderStyle: 'solid', borderWidth: 1, borderColor: '#000', backgroundColor: '#e0e0e0', padding: 4 },
  tableCol: { width: '50%', borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', padding: 4 },
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
      <Text style={styles.watermark}>Ecommerce Store</Text>
      
      <View style={styles.section}>
        <Text style={styles.heading}>Sales Data</Text>
        <Image src={charts.salesChart} style={styles.chartImage} />
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Date</Text>
            <Text style={styles.tableColHeader}>Total ($)</Text>
          </View>
          {salesData.map(data => (
            <View style={styles.tableRow} key={data.date}>
              <Text style={styles.tableCol}>{data.date}</Text>
              <Text style={styles.tableCol}>{data.total}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.heading}>User Registrations</Text>
        <Image src={charts.userRegistrationsChart} style={styles.chartImage} />
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Date</Text>
            <Text style={styles.tableColHeader}>Registrations</Text>
          </View>
          {userRegistrations.map(data => (
            <View style={styles.tableRow} key={data.date}>
              <Text style={styles.tableCol}>{data.date}</Text>
              <Text style={styles.tableCol}>{data.count}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Product Performance</Text>
        <Image src={charts.productPerformanceChart} style={styles.chartImage} />
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Product</Text>
            <Text style={styles.tableColHeader}>Reviews / Avg Rating</Text>
          </View>
          {productPerformance.map(data => (
            <View style={styles.tableRow} key={data.productname}>
              <Text style={styles.tableCol}>{data.productname}</Text>
              <Text style={styles.tableCol}>{data.total_reviews} / {data.average_rating}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Order Status</Text>
        <Image src={charts.orderStatsChart} style={styles.chartImage} />
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Status</Text>
            <Text style={styles.tableColHeader}>Count</Text>
          </View>
          {orderStats.map(data => (
            <View style={styles.tableRow} key={data.status}>
              <Text style={styles.tableCol}>{data.status}</Text>
              <Text style={styles.tableCol}>{data.count}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Recommendations</Text>
        <Image src={charts.recommendationsChart} style={styles.chartImage} />
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Category</Text>
            <Text style={styles.tableColHeader}>Count</Text>
          </View>
          {recommendationsData.map(data => (
            <View style={styles.tableRow} key={data.category}>
              <Text style={styles.tableCol}>{data.category}</Text>
              <Text style={styles.tableCol}>{data.total_recommendations}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Product Ratings</Text>
        <Image src={charts.productRatingsChart} style={styles.chartImage} />
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
    <div className="container mx-auto px-4 py-8 ">
      <div className='flex justify-between items-center mb-4'>
      <h1 className="text-2xl font-bold mb-6 text-white">Admin Dashboard</h1>
      <div className=" right-0 mb-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded shadow">
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-black">Sales Data</h2>
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
          <h2 className="text-xl font-bold mb-4 text-black">User Registrations</h2>
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
          <h2 className="text-xl font-bold mb-4 text-black">Product Performance</h2>
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
          <h2 className="text-xl font-bold mb-4 text-black">Order Status</h2>
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
          <h2 className="text-xl font-bold mb-4 text-black">Recommendations</h2>
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
          <h2 className="text-xl font-bold mb-4 text-black">Product Ratings</h2>
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
