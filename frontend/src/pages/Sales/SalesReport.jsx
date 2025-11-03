import React, { useState, useContext } from "react";
import {
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
  Filter,
  Search,
  Package,
  Clock,
  Eye,
  X,
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

const SalesReport = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState("today");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Mock sales data matching your schema
  const salesData = [
    {
      saleId: "SALE-2024-001",
      items: [
        { sku: "LAP-001", name: "Gaming Laptop", qty: 1, price: 1299, subtotal: 1299 },
        { sku: "MOU-001", name: "Wireless Mouse", qty: 2, price: 29, subtotal: 58 },
      ],
      total: 1357,
      paymentMethod: "upi",
      paymentStatus: "paid",
      createdBy: { name: "John Smith" },
      createdAt: "2024-11-03T10:30:00Z",
    },
    {
      saleId: "SALE-2024-002",
      items: [
        { sku: "PHN-001", name: "Smartphone Pro", qty: 1, price: 899, subtotal: 899 },
        { sku: "CAS-001", name: "Phone Case", qty: 1, price: 25, subtotal: 25 },
      ],
      total: 924,
      paymentMethod: "cash",
      paymentStatus: "paid",
      createdBy: { name: "Sarah Johnson" },
      createdAt: "2024-11-03T09:15:00Z",
    },
    {
      saleId: "SALE-2024-003",
      items: [
        { sku: "HDP-001", name: "Wireless Headphones", qty: 3, price: 199, subtotal: 597 },
      ],
      total: 597,
      paymentMethod: "card",
      paymentStatus: "paid",
      createdBy: { name: "Mike Davis" },
      createdAt: "2024-11-03T08:45:00Z",
    },
    {
      saleId: "SALE-2024-004",
      items: [
        { sku: "KEY-001", name: "Mechanical Keyboard", qty: 2, price: 149, subtotal: 298 },
        { sku: "MOU-002", name: "Gaming Mouse", qty: 2, price: 79, subtotal: 158 },
      ],
      total: 456,
      paymentMethod: "upi",
      paymentStatus: "paid",
      createdBy: { name: "Emily Brown" },
      createdAt: "2024-11-02T16:20:00Z",
    },
    {
      saleId: "SALE-2024-005",
      items: [
        { sku: "TAB-001", name: "Tablet", qty: 1, price: 549, subtotal: 549 },
      ],
      total: 549,
      paymentMethod: "bank",
      paymentStatus: "pending",
      createdBy: { name: "David Wilson" },
      createdAt: "2024-11-02T14:10:00Z",
    },
    {
      saleId: "SALE-2024-006",
      items: [
        { sku: "MON-001", name: "4K Monitor", qty: 1, price: 399, subtotal: 399 },
        { sku: "CAB-001", name: "HDMI Cable", qty: 2, price: 15, subtotal: 30 },
      ],
      total: 429,
      paymentMethod: "cash",
      paymentStatus: "paid",
      createdBy: { name: "Lisa Anderson" },
      createdAt: "2024-11-01T11:30:00Z",
    },
  ];

  // Calculate statistics
  const totalRevenue = salesData.reduce((sum, sale) => sum + sale.total, 0);
  const totalSales = salesData.length;
  const totalItems = salesData.reduce((sum, sale) => 
    sum + sale.items.reduce((itemSum, item) => itemSum + item.qty, 0), 0
  );
  const avgOrderValue = totalRevenue / totalSales;

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: "+24.5%",
      gradient: "from-violet-500 to-purple-600",
      iconBg: "from-violet-500/20 to-purple-600/20",
    },
    {
      title: "Total Sales",
      value: totalSales,
      icon: FileText,
      change: "+18.2%",
      gradient: "from-blue-500 to-cyan-600",
      iconBg: "from-blue-500/20 to-cyan-600/20",
    },
    {
      title: "Items Sold",
      value: totalItems,
      icon: Package,
      change: "+12.8%",
      gradient: "from-emerald-500 to-green-600",
      iconBg: "from-emerald-500/20 to-green-600/20",
    },
    {
      title: "Avg Order Value",
      value: `$${Math.round(avgOrderValue)}`,
      icon: TrendingUp,
      change: "+8.4%",
      gradient: "from-orange-500 to-red-600",
      iconBg: "from-orange-500/20 to-red-600/20",
    },
  ];

  const paymentMethodColors = {
    upi: "from-blue-500/20 to-cyan-600/20",
    cash: "from-emerald-500/20 to-green-600/20",
    card: "from-violet-500/20 to-purple-600/20",
    bank: "from-orange-500/20 to-red-600/20",
  };

  const paymentMethodIcons = {
    upi: "📱",
    cash: "💵",
    card: "💳",
    bank: "🏦",
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredSales = salesData.filter((sale) => {
    const matchesSearch =
      sale.saleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesPayment =
      paymentFilter === "all" || sale.paymentMethod === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${
              isDark
                ? "from-white via-gray-200 to-gray-400"
                : "from-gray-900 via-gray-700 to-gray-600"
            } bg-clip-text text-transparent`}
          >
            Sales Report
          </h1>
          <p
            className={`mt-2 flex items-center gap-2 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            className={`${
              isDark
                ? "border-gray-700 hover:bg-gray-800"
                : "border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button
            className={`bg-gradient-to-r ${
              isDark
                ? "from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                : "from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
            } shadow-lg`}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
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
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-sm font-semibold flex items-center gap-1 text-emerald-500">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </span>
                    <span
                      className={`text-xs ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      vs last period
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

      {/* Filters Section */}
      {filterOpen && (
        <Card
          className={`border-0 overflow-hidden ${
            isDark
              ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
              : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
          }`}
        >
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  className={`text-sm font-medium mb-2 block ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <div>
                <label
                  className={`text-sm font-medium mb-2 block ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Payment Method
                </label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="all">All Methods</option>
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDateRange("today");
                    setPaymentFilter("all");
                  }}
                  className={`w-full ${
                    isDark
                      ? "border-gray-700 hover:bg-gray-800"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sales Table */}
      <Card
        className={`border-0 overflow-hidden ${
          isDark
            ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
            : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
        }`}
      >
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle
                className={`bg-gradient-to-r ${
                  isDark
                    ? "from-white to-gray-400"
                    : "from-gray-900 to-gray-600"
                } bg-clip-text text-transparent`}
              >
                All Sales Transactions
              </CardTitle>
              <CardDescription>
                Complete list of sales with details
              </CardDescription>
            </div>
            <div className="relative w-full lg:w-80">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search by Sale ID or Product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`border-b ${
                    isDark ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  <th
                    className={`text-left py-4 px-4 font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Sale ID
                  </th>
                  <th
                    className={`text-left py-4 px-4 font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Date & Time
                  </th>
                  <th
                    className={`text-left py-4 px-4 font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Items
                  </th>
                  <th
                    className={`text-left py-4 px-4 font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Payment
                  </th>
                  <th
                    className={`text-left py-4 px-4 font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Status
                  </th>
                  <th
                    className={`text-right py-4 px-4 font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Total
                  </th>
                  <th
                    className={`text-left py-4 px-4 font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr
                    key={sale.saleId}
                    className={`border-b transition-colors ${
                      isDark
                        ? "border-gray-800 hover:bg-gray-800/50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isDark ? "bg-gray-800" : "bg-gray-100"
                          }`}
                        >
                          <FileText
                            className={`h-4 w-4 ${
                              isDark ? "text-violet-400" : "text-violet-600"
                            }`}
                          />
                        </div>
                        <span
                          className={`font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {sale.saleId}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`py-4 px-4 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {formatDate(sale.createdAt)}
                      </div>
                    </td>
                    <td
                      className={`py-4 px-4 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        {sale.items.length} item(s)
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${
                          paymentMethodColors[sale.paymentMethod]
                        }`}
                      >
                        <span className="text-sm">
                          {paymentMethodIcons[sale.paymentMethod]}
                        </span>
                        <span
                          className={`text-sm font-medium capitalize ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {sale.paymentMethod}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          sale.paymentStatus === "paid"
                            ? "bg-emerald-500/20 text-emerald-500"
                            : "bg-orange-500/20 text-orange-500"
                        }`}
                      >
                        {sale.paymentStatus === "paid" ? "✓" : "⏳"}
                        {sale.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td
                      className={`py-4 px-4 text-right font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ${sale.total.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSale(sale)}
                        className={isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Sale Detail Modal */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div
            className={`max-w-2xl w-full rounded-xl shadow-2xl ${
              isDark
                ? "bg-gradient-to-br from-gray-900 to-gray-800"
                : "bg-gradient-to-br from-white to-gray-50"
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2
                    className={`text-2xl font-bold bg-gradient-to-r ${
                      isDark
                        ? "from-white to-gray-400"
                        : "from-gray-900 to-gray-600"
                    } bg-clip-text text-transparent`}
                  >
                    Sale Details
                  </h2>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Complete information for {selectedSale.saleId}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSale(null)}
                  className={isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Sale Info */}
                <div
                  className={`grid grid-cols-2 gap-4 p-4 rounded-xl ${
                    isDark ? "bg-gray-800/50" : "bg-gray-100"
                  }`}
                >
                  <div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Sale ID
                    </p>
                    <p
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedSale.saleId}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Date & Time
                    </p>
                    <p
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {formatDate(selectedSale.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Payment Method
                    </p>
                    <p
                      className={`font-semibold capitalize ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {paymentMethodIcons[selectedSale.paymentMethod]}{" "}
                      {selectedSale.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Status
                    </p>
                    <p
                      className={`font-semibold capitalize ${
                        selectedSale.paymentStatus === "paid"
                          ? "text-emerald-500"
                          : "text-orange-500"
                      }`}
                    >
                      {selectedSale.paymentStatus}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3
                    className={`font-semibold mb-3 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Items ({selectedSale.items.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedSale.items.map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          isDark ? "bg-gray-800/50" : "bg-gray-100"
                        }`}
                      >
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.name}
                          </p>
                          <p
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            SKU: {item.sku} • Qty: {item.qty} • ${item.price}{" "}
                            each
                          </p>
                        </div>
                        <p
                          className={`font-bold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          ${item.subtotal.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div
                  className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                    isDark
                      ? "bg-gray-800/50 border-violet-500/30"
                      : "bg-violet-50 border-violet-200"
                  }`}
                >
                  <span
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Total Amount
                  </span>
                  <span
                    className={`text-2xl font-bold ${
                      isDark ? "text-violet-400" : "text-violet-600"
                    }`}
                  >
                    ${selectedSale.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReport;