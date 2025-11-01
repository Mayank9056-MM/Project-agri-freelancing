import React, { useState, useContext } from "react";
import {
  Package,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Filter,
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
import { Navigate, useNavigate } from "react-router-dom";

const ProductList = ({ onEdit, onDelete, onView }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const [products] = useState([
    {
      id: 1,
      name: "Laptop",
      sku: "LAP-001",
      category: "Electronics",
      price: 1299,
      stock: 45,
      sold: 156,
      reorderLevel: 20,
      status: "in-stock",
      image: "💻",
    },
    {
      id: 2,
      name: "Smartphone",
      sku: "PHN-001",
      category: "Electronics",
      price: 599,
      stock: 78,
      sold: 234,
      reorderLevel: 30,
      status: "in-stock",
      image: "📱",
    },
    {
      id: 3,
      name: "Headphones",
      sku: "AUD-001",
      category: "Audio",
      price: 199,
      stock: 124,
      sold: 387,
      reorderLevel: 50,
      status: "in-stock",
      image: "🎧",
    },
    {
      id: 4,
      name: "Wireless Mouse",
      sku: "ACC-001",
      category: "Accessories",
      price: 29,
      stock: 18,
      sold: 445,
      reorderLevel: 40,
      status: "low-stock",
      image: "🖱️",
    },
    {
      id: 5,
      name: "Mechanical Keyboard",
      sku: "ACC-002",
      category: "Accessories",
      price: 75,
      stock: 98,
      sold: 289,
      reorderLevel: 30,
      status: "in-stock",
      image: "⌨️",
    },
    {
      id: 6,
      name: "USB-C Cable",
      sku: "CBL-001",
      category: "Cables",
      price: 15,
      stock: 8,
      sold: 678,
      reorderLevel: 100,
      status: "low-stock",
      image: "🔌",
    },
    {
      id: 7,
      name: "Webcam",
      sku: "CAM-001",
      category: "Electronics",
      price: 89,
      stock: 0,
      sold: 156,
      reorderLevel: 25,
      status: "out-of-stock",
      image: "📷",
    },
    {
      id: 8,
      name: "Monitor Stand",
      sku: "ACC-003",
      category: "Accessories",
      price: 45,
      stock: 67,
      sold: 123,
      reorderLevel: 20,
      status: "in-stock",
      image: "🖥️",
    },
  ]);

  const categories = ["all", "Electronics", "Audio", "Accessories", "Cables"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesStock =
      stockFilter === "all" || product.status === stockFilter;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "in-stock":
        return isDark
          ? "from-emerald-500/20 to-green-600/20 text-emerald-400 border-emerald-500/30"
          : "from-emerald-50 to-green-50 text-emerald-700 border-emerald-200";
      case "low-stock":
        return isDark
          ? "from-amber-500/20 to-orange-600/20 text-amber-400 border-amber-500/30"
          : "from-amber-50 to-orange-50 text-amber-700 border-amber-200";
      case "out-of-stock":
        return isDark
          ? "from-rose-500/20 to-red-600/20 text-rose-400 border-rose-500/30"
          : "from-rose-50 to-red-50 text-rose-700 border-rose-200";
      default:
        return "";
    }
  };

  const getStockIcon = (product) => {
    if (product.stock === 0) return <AlertTriangle className="h-4 w-4" />;
    if (product.stock < product.reorderLevel)
      return <TrendingDown className="h-4 w-4" />;
    return <TrendingUp className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${
              isDark
                ? "from-white via-gray-200 to-gray-400"
                : "from-gray-900 via-gray-700 to-gray-600"
            } bg-clip-text text-transparent`}
          >
            Products
          </h1>
          <p
            className={`mt-2 flex items-center gap-2 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <Package className="h-4 w-4" />
            {filteredProducts.length} products in inventory
          </p>
        </div>
        <Button
          onClick={() => navigate("/products/add")}
          className={`bg-gradient-to-r ${
            isDark
              ? "from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              : "from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          } shadow-lg`}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <Card
        className={`border-0 overflow-hidden ${
          isDark
            ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
            : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-violet-500/20"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:ring-violet-400/20"
                }`}
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className={`${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {(categoryFilter !== "all" || stockFilter !== "all") && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-violet-500 text-white text-xs">
                  {(categoryFilter !== "all" ? 1 : 0) +
                    (stockFilter !== "all" ? 1 : 0)}
                </span>
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-700 flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white focus:border-violet-500 focus:ring-violet-500/20"
                      : "bg-white border-gray-200 text-gray-900 focus:border-violet-400 focus:ring-violet-400/20"
                  }`}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Stock Status
                </label>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white focus:border-violet-500 focus:ring-violet-500/20"
                      : "bg-white border-gray-200 text-gray-900 focus:border-violet-400 focus:ring-violet-400/20"
                  }`}
                >
                  <option value="all">All Status</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
              {(categoryFilter !== "all" || stockFilter !== "all") && (
                <div className="flex items-end">
                  <Button
                    onClick={() => {
                      setCategoryFilter("all");
                      setStockFilter("all");
                    }}
                    className={`${
                      isDark
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <Card
            onClick={() => navigate(`/products/${product.id}`)}
            key={product.id}
            className={`border-0 overflow-hidden group hover:scale-105 transition-all duration-300 cursor-pointer ${
              isDark
                ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl shadow-black/40"
                : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                    isDark
                      ? "bg-gradient-to-br from-violet-500/20 to-purple-600/20"
                      : "bg-gradient-to-br from-violet-50 to-purple-50"
                  }`}
                >
                  {product.image}
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold border bg-gradient-to-br ${getStatusColor(
                    product.status
                  )}`}
                >
                  <div className="flex items-center gap-1">
                    {getStockIcon(product)}
                    {product.status.replace("-", " ")}
                  </div>
                </div>
              </div>

              <h3
                className={`text-lg font-bold mb-1 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {product.name}
              </h3>
              <p
                className={`text-sm mb-4 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {product.sku} • {product.category}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Price
                  </span>
                  <span
                    className={`text-lg font-bold bg-gradient-to-r ${
                      isDark
                        ? "from-emerald-400 to-green-500"
                        : "from-emerald-600 to-green-700"
                    } bg-clip-text text-transparent`}
                  >
                    ${product.price}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    In Stock
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {product.stock} units
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Total Sold
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {product.sold} units
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-700">
                <Button
                  onClick={() => onView(product)}
                  className={`flex-1 ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => onEdit(product)}
                  className={`flex-1 bg-gradient-to-r ${
                    isDark
                      ? "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                      : "from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                  }`}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => onDelete(product)}
                  className={`flex-1 bg-gradient-to-r ${
                    isDark
                      ? "from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700"
                      : "from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700"
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card
          className={`border-0 ${
            isDark
              ? "bg-gradient-to-br from-gray-900 to-gray-800"
              : "bg-gradient-to-br from-white to-gray-50"
          }`}
        >
          <CardContent className="p-12 text-center">
            <Package
              className={`h-16 w-16 mx-auto mb-4 ${
                isDark ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <h3
              className={`text-xl font-semibold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              No products found
            </h3>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductList;
