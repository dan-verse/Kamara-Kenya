"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Order } from "@/types";

interface AnalyticsChartsProps {
  orders: Order[];
  revenue: number;
}

export default function AnalyticsCharts({ orders }: AnalyticsChartsProps) {
  // Convert raw orders into chart-friendly format
  const chartData = orders.map((order) => ({
    date: new Date(order.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    sales: order.total,
    items: order.items.reduce((n, i) => n + i.quantity, 0),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
      {/* ------- SALES LINE CHART ------- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Sales Over Time
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={3} />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ------- ITEMS SOLD BAR CHART ------- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Items Sold
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="items" fill="#10B981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
