import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function AdminAnalytics() {
  const { admin, token } = useAdminAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    revenue: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
  });

  const [loading, setLoading] = useState(true);

  // Protect route
  useEffect(() => {
    if (!admin || !token) {
      navigate("/admin/login");
    }
  }, [admin, token, navigate]);

  // Fetch analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/orders/admin/analytics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log("Analytics Data:", data);

        setAnalytics(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load analytics:", err);
        setLoading(false);
      }
    };

    if (token) fetchAnalytics();
  }, [token]);

  if (loading) {
    return <h2 className="text-center mt-10">Loading analytics...</h2>;
  }

  // Pie Chart Data (Order Status)
  const pieData = {
    labels: ["Processing", "Shipped", "Delivered"],
    datasets: [
      {
        data: [
          analytics.processing,
          analytics.shipped,
          analytics.delivered,
        ],
        backgroundColor: ["#facc15", "#3b82f6", "#22c55e"],
      },
    ],
  };

  // Bar Chart Data (Revenue)
  const barData = {
    labels: ["Revenue"],
    datasets: [
      {
        label: "Total Revenue (₹)",
        data: [analytics.revenue],
        backgroundColor: "#7c2d12",
      },
    ],
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Admin Analytics Dashboard</h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="font-bold">Total Orders</h3>
          <p className="text-2xl">{analytics.totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="font-bold">Revenue</h3>
          <p className="text-2xl">₹ {analytics.revenue}</p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="font-bold">Processing</h3>
          <p className="text-2xl">{analytics.processing}</p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="font-bold">Delivered</h3>
          <p className="text-2xl">{analytics.delivered}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4 text-center">
            Orders Status Distribution
          </h2>
          <Pie data={pieData} />
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4 text-center">
            Revenue Overview
          </h2>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
}
