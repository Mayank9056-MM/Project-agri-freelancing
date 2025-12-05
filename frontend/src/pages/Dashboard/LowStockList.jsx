import React, { useState, useContext, useEffect } from "react";
import {
  Package,
  AlertTriangle,
  TrendingDown,
  Search,
  Filter,
  Download,
  RefreshCw,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeContext } from "@/context/ThemeContext";
import { AuthContext } from "@/context/AuthContext";
import { ProductContext } from "@/context/ProductContext";

const LowStock = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const { user } = useContext(AuthContext);

  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { getLowStockProducts } = useContext(ProductContext);

  const fetchLowStock = async () => {
    try {
      const res = await getLowStockProducts();
      console.log(res)
      setLowStockItems(res.products || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load low stock items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
  }, []);

  // // Mock data - replace with actual API data
  // const lowStockItems = [
  //   {
  //     id: 1,
  //     sku: "LAP-001",
  //     name: "Dell XPS 15 Laptop",
  //     currentStock: 3,
  //     minStock: 10,
  //     reorderPoint: 8,
  //     price: 1299,
  //     category: "Electronics",
  //     supplier: "Dell Inc.",
  //     lastRestocked: "2024-10-15",
  //     status: "critical",
  //   },
  //   {
  //     id: 2,
  //     sku: "PHN-102",
  //     name: "iPhone 15 Pro",
  //     currentStock: 5,
  //     minStock: 15,
  //     reorderPoint: 12,
  //     price: 999,
  //     category: "Smartphones",
  //     supplier: "Apple",
  //     lastRestocked: "2024-10-20",
  //     status: "low",
  //   },
  //   {
  //     id: 3,
  //     sku: "TAB-205",
  //     name: "iPad Air",
  //     currentStock: 2,
  //     minStock: 8,
  //     reorderPoint: 6,
  //     price: 599,
  //     category: "Tablets",
  //     supplier: "Apple",
  //     lastRestocked: "2024-10-18",
  //     status: "critical",
  //   },
  //   {
  //     id: 4,
  //     sku: "HDP-301",
  //     name: "Sony WH-1000XM5",
  //     currentStock: 7,
  //     minStock: 20,
  //     reorderPoint: 15,
  //     price: 399,
  //     category: "Audio",
  //     supplier: "Sony",
  //     lastRestocked: "2024-10-25",
  //     status: "low",
  //   },
  //   {
  //     id: 5,
  //     sku: "MON-403",
  //     name: "LG UltraWide Monitor",
  //     currentStock: 1,
  //     minStock: 6,
  //     reorderPoint: 5,
  //     price: 799,
  //     category: "Monitors",
  //     supplier: "LG Electronics",
  //     lastRestocked: "2024-10-12",
  //     status: "critical",
  //   },
  //   {
  //     id: 6,
  //     sku: "KBD-501",
  //     name: "Logitech MX Keys",
  //     currentStock: 8,
  //     minStock: 25,
  //     reorderPoint: 18,
  //     price: 99,
  //     category: "Accessories",
  //     supplier: "Logitech",
  //     lastRestocked: "2024-10-28",
  //     status: "low",
  //   },
  //   {
  //     id: 7,
  //     sku: "MSE-502",
  //     name: "Logitech MX Master 3S",
  //     currentStock: 4,
  //     minStock: 20,
  //     reorderPoint: 15,
  //     price: 99,
  //     category: "Accessories",
  //     supplier: "Logitech",
  //     lastRestocked: "2024-10-22",
  //     status: "low",
  //   },
  //   {
  //     id: 8,
  //     sku: "CAM-601",
  //     name: "Logitech Brio 4K Webcam",
  //     currentStock: 2,
  //     minStock: 10,
  //     reorderPoint: 8,
  //     price: 199,
  //     category: "Accessories",
  //     supplier: "Logitech",
  //     lastRestocked: "2024-10-10",
  //     status: "critical",
  //   },
  // ];

  const stats = [
    {
      title: "Critical Items",
      value: lowStockItems
        .filter((item) => item.status === "critical")
        .length.toString(),
      icon: AlertTriangle,
      change: "Urgent",
      subtext: "Need immediate restock",
      gradient: "from-rose-500 to-red-600",
      iconBg: "from-rose-500/20 to-red-600/20",
      changeColor: "text-rose-500",
    },
    {
      title: "Low Stock Items",
      value: lowStockItems
        .filter((item) => item.status === "low")
        .length.toString(),
      icon: TrendingDown,
      change: "Warning",
      subtext: "Below reorder point",
      gradient: "from-amber-500 to-orange-600",
      iconBg: "from-amber-500/20 to-orange-600/20",
      changeColor: "text-amber-500",
    },
    {
      title: "Total Value at Risk",
      value: `$${lowStockItems
        .reduce((acc, item) => acc + item.currentStock * item.price, 0)
        .toLocaleString()}`,
      icon: Package,
      change: "+$12.5K",
      subtext: "Current inventory value",
      gradient: "from-blue-500 to-cyan-600",
      iconBg: "from-blue-500/20 to-cyan-600/20",
      changeColor: "text-blue-500",
    },
    {
      title: "Reorder Required",
      value: lowStockItems.length.toString(),
      icon: ShoppingCart,
      change: "Action Needed",
      subtext: "Items to restock",
      gradient: "from-violet-500 to-purple-600",
      iconBg: "from-violet-500/20 to-purple-600/20",
      changeColor: "text-violet-500",
    },
  ];

  const getStatusBadge = (status) => {
    if (status === "critical") {
      return {
        bg: isDark ? "bg-rose-500/20" : "bg-rose-100",
        text: isDark ? "text-rose-400" : "text-rose-700",
        icon: XCircle,
        label: "Critical",
      };
    }
    return {
      bg: isDark ? "bg-amber-500/20" : "bg-amber-100",
      text: isDark ? "text-amber-400" : "text-amber-700",
      icon: AlertCircle,
      label: "Low Stock",
    };
  };

  const getStockPercentage = (current, min) => {
    return (current / min) * 100;
  };

  const filteredItems = lowStockItems.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase()?.includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1
            className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${
              isDark
                ? "from-white via-gray-200 to-gray-400"
                : "from-gray-900 via-gray-700 to-gray-600"
            } bg-clip-text text-transparent`}
          >
            Low Stock Alerts
          </h1>
          <p
            className={`mt-2 flex items-center gap-2 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            Monitor and manage inventory levels
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className={`${
              isDark
                ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={fetchLowStock}
            className={`bg-gradient-to-r ${
              isDark
                ? "from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                : "from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
            } shadow-lg`}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
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
                      className={`text-sm font-semibold ${stat.changeColor}`}
                    >
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

      {/* Filters and Search */}
      <Card
        className={`border-0 ${
          isDark
            ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
            : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                } focus:outline-none focus:ring-2 focus:ring-violet-500`}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                className={
                  filterStatus === "all"
                    ? "bg-gradient-to-r from-violet-600 to-purple-600"
                    : isDark
                    ? "bg-gray-800 border-gray-700"
                    : ""
                }
              >
                All
              </Button>
              <Button
                variant={filterStatus === "critical" ? "default" : "outline"}
                onClick={() => setFilterStatus("critical")}
                className={
                  filterStatus === "critical"
                    ? "bg-gradient-to-r from-rose-600 to-red-600"
                    : isDark
                    ? "bg-gray-800 border-gray-700"
                    : ""
                }
              >
                Critical
              </Button>
              <Button
                variant={filterStatus === "low" ? "default" : "outline"}
                onClick={() => setFilterStatus("low")}
                className={
                  filterStatus === "low"
                    ? "bg-gradient-to-r from-amber-600 to-orange-600"
                    : isDark
                    ? "bg-gray-800 border-gray-700"
                    : ""
                }
              >
                Low Stock
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Items Table */}
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
            Inventory Items
          </CardTitle>
          <CardDescription>
            {filteredItems.length} items require attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const statusBadge = getStatusBadge(item.status);
              const stockPercentage = getStockPercentage(
                item.currentStock,
                item.minStock
              );

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all hover:scale-[1.01] ${
                    isDark
                      ? "bg-gray-800/50 hover:bg-gray-800 border-gray-700/50"
                      : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-semibold text-lg truncate ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.name}
                          </h3>
                          <p
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            SKU: {item.sku} • {item.category}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusBadge.bg}`}
                        >
                          <statusBadge.icon
                            className={`h-4 w-4 ${statusBadge.text}`}
                          />
                          <span
                            className={`text-xs font-semibold ${statusBadge.text}`}
                          >
                            {statusBadge.label}
                          </span>
                        </div>
                      </div>

                      {/* Stock Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span
                            className={`${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Current Stock
                          </span>
                          <span
                            className={`font-semibold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.currentStock} / {item.minStock}
                          </span>
                        </div>
                        <div
                          className={`h-2 rounded-full overflow-hidden ${
                            isDark ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className={`h-full rounded-full transition-all ${
                              item.status === "critical"
                                ? "bg-gradient-to-r from-rose-500 to-red-600"
                                : "bg-gradient-to-r from-amber-500 to-orange-600"
                            }`}
                            style={{
                              width: `${Math.min(stockPercentage, 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-500" : "text-gray-500"
                            }`}
                          >
                            Price
                          </p>
                          <p
                            className={`font-semibold ${
                              isDark ? "text-emerald-400" : "text-emerald-600"
                            }`}
                          >
                            ${item.price}
                          </p>
                        </div>
                        <div>
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-500" : "text-gray-500"
                            }`}
                          >
                            Reorder Point
                          </p>
                          <p
                            className={`font-semibold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.reorderPoint}
                          </p>
                        </div>
                        <div>
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-500" : "text-gray-500"
                            }`}
                          >
                            Supplier
                          </p>
                          <p
                            className={`font-semibold truncate ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.supplier}
                          </p>
                        </div>
                        <div>
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-500" : "text-gray-500"
                            }`}
                          >
                            Last Restocked
                          </p>
                          <p
                            className={`font-semibold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {new Date(item.lastRestocked).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className={`bg-gradient-to-r ${
                        item.status === "critical"
                          ? "from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700"
                          : "from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                      } shadow-lg whitespace-nowrap`}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Reorder Now
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LowStock;
