import React, { useContext, useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  AlertCircle,
  QrCode,
  Calendar,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ThemeContext } from "@/context/ThemeContext";
import { AuthContext } from "@/context/AuthContext";
import { SaleContext } from "@/context/SaleContext";
import { ProductContext } from "@/context/ProductContext";

const Dashboard = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const { user } = useContext(AuthContext);

  const { getAllSales } = useContext(SaleContext);
  const { getAllProducts, getLowStockProducts } = useContext(ProductContext);

  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Fetches all data required for the dashboard page:
     * - sales data from the SaleContext
     * - products data from the ProductContext
     * - low stock products data from the ProductContext
     *
     * Sets the state variables for sales, products, and low stock products
     *
     * Catch any errors that occur while fetching the data and log them to the console
     *
     * Finally, sets the loading state variable to false
     */
    const fetchDashboardData = async () => {
      try {
        const [salesRes, productsRes, lowRes] = await Promise.all([
          getAllSales(),
          getAllProducts(),
          getLowStockProducts(),
        ]);

        setSales(salesRes || []);
        setProducts(productsRes.products || productsRes || []);
        setLowStock(lowRes.products || []);
      } catch (err) {
        console.error("Dashboard data error:", err);
        setProducts([]);
        setSales([]);
        setLowStock([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const salesData = (() => {
    const daily = {};

    sales.forEach((s) => {
      const date = new Date(s.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const total = s.total || 0;
      daily[date] = (daily[date] || 0) + total;
    });

    // Format for Recharts
    return Object.entries(daily).map(([date, revenue]) => ({
      date,
      revenue,
      orders: sales.filter(
        (s) =>
          new Date(s.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }) === date
      ).length,
    }));
  })();

  const totalRevenue = sales.reduce((sum, s) => sum + (s.total || 0), 0);
  const totalOrders = sales.length;
  const totalProducts = products.length;
  const totalLowStock = lowStock.length;

  // --- Compute top selling products ---
  const productSalesMap = {};
  console.log(sales);
  sales.forEach((sale) => {
    sale.items?.forEach((item) => {
      const id = item?.sku; // handle populated or ID
      if (!productSalesMap[id]) {
        productSalesMap[id] = {
          name: item?.name || "Unknown Product",
          sold: 0,
          revenue: 0,
        };
      }
      productSalesMap[id].sold += item.qty || 0;
      productSalesMap[id].revenue += (item.qty || 0) * (item.price || 0);
    });
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  const stats = [
    {
      title: "Total Revenue",
      value: ` ₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: "+18.2%",
      subtext: `${totalOrders} orders`,
      gradient: "from-violet-500 to-purple-600",
      iconBg: "from-violet-500/20 to-purple-600/20",
    },
    {
      title: "Total Sales",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      change: "+12.5%",
      subtext: "Orders processed",
      gradient: "from-blue-500 to-cyan-600",
      iconBg: "from-blue-500/20 to-cyan-600/20",
    },
    {
      title: "Products",
      value: totalProducts.toString(),
      icon: Package,
      change: "+5.3%",
      subtext: `${totalProducts - totalLowStock} in stock`,
      gradient: "from-emerald-500 to-green-600",
      iconBg: "from-emerald-500/20 to-green-600/20",
    },
    {
      title: "Low Stock",
      value: totalLowStock.toString(),
      icon: AlertCircle,
      change: totalLowStock > 0 ? "Critical" : "Healthy",
      subtext: "Inventory status",
      gradient: "from-rose-500 to-red-600",
      iconBg: "from-rose-500/20 to-red-600/20",
    },
  ];

  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const lowStockCount = lowStock.length;
  const inStockCount = totalProducts - lowStockCount - outOfStockCount;

  const stockStatus = [
    { name: "In Stock", value: inStockCount, color: "#10b981" },
    { name: "Low Stock", value: lowStockCount, color: "#f59e0b" },
    { name: "Out of Stock", value: outOfStockCount, color: "#ef4444" },
  ];
  {
    console.log(sales);
  }
  const recentSales = sales.slice(0, 5).map((s) => ({
    id: s._id?.slice(-5).toUpperCase(),
    customer: s.createdBy?.email || "Guest",
    items: s.items?.length || 0,
    amount: s.total.toFixed(2),
    payment: s.paymentMethod,
    time: new Date(s.createdAt).toLocaleTimeString(),
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`rounded-xl p-4 shadow-2xl border backdrop-blur-xl ${
            isDark
              ? "bg-gray-900/95 border-gray-800"
              : "bg-white/95 border-gray-200"
          }`}
        >
          <p
            className={`font-semibold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {payload[0].payload.date || payload[0].payload.month}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mt-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {entry.name}:{" "}
                <span className="font-semibold">{entry.value}</span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-500">
        Loading dashboard data...
      </div>
    );
  }

  if (!sales.length && !products.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500">
        <AlertCircle className="w-8 h-8 mb-3 text-gray-400" />
        <p>No sales or products data available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${
              isDark
                ? "from-white via-gray-200 to-gray-400"
                : "from-gray-900 via-gray-700 to-gray-600"
            } bg-clip-text text-transparent`}
          >
            Sales Dashboard
          </h1>
          <p
            className={`mt-2 flex items-center gap-2 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Today,{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Button
          className={`bg-gradient-to-r ${
            isDark
              ? "from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              : "from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          } shadow-lg`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={`border-0 overflow-hidden relative group hover:scale-105 transition-all duration-300 cursor-pointer ${
              isDark
                ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl shadow-black/40"
                : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {stat.title}
                  </p>
                  <p
                    className={`text-3xl font-bold mt-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span
                      className={`text-sm font-semibold flex items-center gap-1 ${
                        stat.change.startsWith("+")
                          ? "text-emerald-500"
                          : stat.change === "Critical"
                          ? "text-rose-500"
                          : "text-gray-500"
                      }`}
                    >
                      {stat.change.startsWith("+") && (
                        <TrendingUp className="h-3 w-3" />
                      )}
                      {stat.change}
                    </span>
                    <span
                      className={`text-xs ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      {stat.subtext}
                    </span>
                  </div>
                </div>
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${stat.iconBg} backdrop-blur-sm group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
              </div>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          className={`lg:col-span-2 border-0 overflow-hidden ${
            isDark
              ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
              : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
          }`}
        >
          <CardHeader>
            <CardTitle
              className={`flex items-center justify-between bg-gradient-to-r ${
                isDark ? "from-white to-gray-400" : "from-gray-900 to-gray-600"
              } bg-clip-text text-transparent`}
            >
              <span>Revenue Trends</span>
              <span
                className={`text-sm font-normal ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Last 7 days
              </span>
            </CardTitle>
            <CardDescription>
              Daily revenue and order performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "#374151" : "#e5e7eb"}
                  opacity={0.3}
                />
                <XAxis dataKey="date" stroke={isDark ? "#9ca3af" : "#6b7280"} />
                <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card
          className={`border-0 overflow-hidden ${
            isDark
              ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
              : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
          }`}
        >
          <CardHeader>
            <CardTitle
              className={`bg-gradient-to-r ${
                isDark ? "from-white to-gray-400" : "from-gray-900 to-gray-600"
              } bg-clip-text text-transparent`}
            >
              Stock Status
            </CardTitle>
            <CardDescription>Current inventory overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={stockStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stockStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {stockStatus.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          className={`border-0 overflow-hidden ${
            isDark
              ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
              : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
          }`}
        >
          <CardHeader>
            <CardTitle
              className={`bg-gradient-to-r ${
                isDark ? "from-white to-gray-400" : "from-gray-900 to-gray-600"
              } bg-clip-text text-transparent`}
            >
              Top Selling Products
            </CardTitle>
            <CardDescription>Best performers this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all hover:scale-[1.02] ${
                    isDark
                      ? "bg-gray-800/50 hover:bg-gray-800"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                      index === 0
                        ? "bg-gradient-to-br from-yellow-500 to-orange-600 text-white"
                        : index === 1
                        ? "bg-gradient-to-br from-gray-400 to-gray-600 text-white"
                        : index === 2
                        ? "bg-gradient-to-br from-orange-600 to-red-700 text-white"
                        : isDark
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {product.name}
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {product.sold} units sold
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        isDark ? "text-emerald-400" : "text-emerald-600"
                      }`}
                    >
                      ₹{product.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card
          className={`border-0 overflow-hidden ${
            isDark
              ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
              : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
          }`}
        >
          <CardHeader>
            <CardTitle
              className={`bg-gradient-to-r ${
                isDark ? "from-white to-gray-400" : "from-gray-900 to-gray-600"
              } bg-clip-text text-transparent`}
            >
              Recent Sales
            </CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {console.log(recentSales)}
              {recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all hover:scale-[1.02] border ${
                    isDark
                      ? "bg-gray-800/50 hover:bg-gray-800 border-gray-700/50"
                      : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        sale.payment === "UPI"
                          ? "bg-gradient-to-br from-blue-500/20 to-cyan-600/20"
                          : "bg-gradient-to-br from-emerald-500/20 to-green-600/20"
                      }`}
                    >
                      {sale.payment === "UPI" ? (
                        <QrCode className="h-5 w-5 text-blue-400" />
                      ) : (
                        <DollarSign className="h-5 w-5 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-semibold text-sm ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {sale.id}
                      </p>
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {sale.customer} • {sale.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ₹{sale.amount}
                    </p>
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      {sale.items} items
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
