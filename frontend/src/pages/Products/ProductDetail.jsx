import React, { useState, useContext, useEffect } from "react";
import {
  Package,
  Edit2,
  Save,
  X,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Barcode,
  DollarSign,
  Tag,
  Layers,
  CheckCircle,
  ImageIcon,
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
import { useNavigate, useParams } from "react-router-dom";

const ProductDetails = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { id } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Mock product data - replace with your context/API call
  const [product, setProduct] = useState({
    id: 1,
    name: "Laptop",
    sku: "LAP-001",
    category: "Electronics",
    price: 1299,
    stock: 45,
    unit: "pieces",
    barcode: "1234567890123",
    low_stock_threshold: 20,
    sold: 156,
    status: "in-stock",
    image: "💻",
    description: "High-performance laptop with latest specifications",
    supplier: "Tech Supplies Co.",
    dateAdded: "2024-01-15",
    lastUpdated: "2024-10-28",
  });

  const [editForm, setEditForm] = useState({ ...product });

  const categories = ["Electronics", "Audio", "Accessories", "Cables", "Computing", "Peripherals"];
  const units = ["pieces", "boxes", "sets", "pairs", "units"];

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...product });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ ...product });
  };

  const handleSave = () => {
    // Update product with editForm data
    setProduct({ ...editForm });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    // Here you would also update your context/API
  };

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

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

  const getStockIcon = (prod) => {
    if (prod.stock === 0) return <AlertTriangle className="h-5 w-5" />;
    if (prod.stock < prod.low_stock_threshold)
      return <TrendingDown className="h-5 w-5" />;
    return <TrendingUp className="h-5 w-5" />;
  };

  const getStockStatus = (prod) => {
    if (prod.stock === 0) return "out-of-stock";
    if (prod.stock < prod.low_stock_threshold) return "low-stock";
    return "in-stock";
  };

  const currentStatus = getStockStatus(isEditing ? editForm : product);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Success Message */}
      {saveSuccess && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl border-2 transition-all ${
            isDark
              ? "bg-gradient-to-r from-emerald-900/90 to-green-900/90 border-emerald-500/30 backdrop-blur-xl"
              : "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <CheckCircle
              className={`h-6 w-6 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
            <span
              className={`font-semibold ${
                isDark ? "text-emerald-300" : "text-emerald-800"
              }`}
            >
              Product updated successfully!
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/products")}
            className={`${
              isDark
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1
              className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${
                isDark
                  ? "from-white via-gray-200 to-gray-400"
                  : "from-gray-900 via-gray-700 to-gray-600"
              } bg-clip-text text-transparent`}
            >
              {isEditing ? "Edit Product" : "Product Details"}
            </h1>
            <p
              className={`mt-2 flex items-center gap-2 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <Package className="h-4 w-4" />
              {product.sku}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              className={`bg-gradient-to-r ${
                isDark
                  ? "from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                  : "from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              } shadow-lg`}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
          ) : (
            <>
              <Button
                onClick={handleCancel}
                className={`${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                }`}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className={`bg-gradient-to-r ${
                  isDark
                    ? "from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                    : "from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                } shadow-lg`}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Image & Status */}
        <div className="space-y-6">
          {/* Product Image Card */}
          <Card
            className={`border-0 overflow-hidden ${
              isDark
                ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
                : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
            }`}
          >
            <CardContent className="p-8">
              <div
                className={`w-full aspect-square rounded-3xl flex items-center justify-center text-9xl mb-6 ${
                  isDark
                    ? "bg-gradient-to-br from-violet-500/10 to-purple-600/10"
                    : "bg-gradient-to-br from-violet-50 to-purple-50"
                }`}
              >
                {isEditing ? editForm.image : product.image}
              </div>

              {isEditing && (
                <div className="space-y-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <ImageIcon className="h-4 w-4 inline mr-2" />
                    Product Image (Emoji)
                  </label>
                  <input
                    type="text"
                    value={editForm.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    placeholder="Enter emoji (e.g., 💻)"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 text-center text-4xl ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-violet-500/20"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:ring-violet-400/20"
                    }`}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card
            className={`border-0 overflow-hidden ${
              isDark
                ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
                : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
            }`}
          >
            <CardHeader>
              <CardTitle
                className={`text-lg ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Stock Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`px-4 py-3 rounded-xl text-sm font-semibold border bg-gradient-to-br ${getStatusColor(
                  currentStatus
                )}`}
              >
                <div className="flex items-center justify-center gap-2">
                  {getStockIcon(isEditing ? editForm : product)}
                  {currentStatus.replace("-", " ").toUpperCase()}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Current Stock
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {isEditing ? editForm.stock : product.stock} {product.unit}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Low Stock Alert
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      isDark ? "text-amber-400" : "text-amber-600"
                    }`}
                  >
                    {isEditing
                      ? editForm.low_stock_threshold
                      : product.low_stock_threshold}{" "}
                    {product.unit}
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
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  >
                    {product.sold} {product.unit}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Product Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card
            className={`border-0 overflow-hidden ${
              isDark
                ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
                : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
            }`}
          >
            <CardHeader>
              <CardTitle
                className={`text-xl ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Basic Information
              </CardTitle>
              <CardDescription
                className={isDark ? "text-gray-400" : "text-gray-600"}
              >
                {isEditing
                  ? "Update product details below"
                  : "Essential product details"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="space-y-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <Package className="h-4 w-4 inline mr-2" />
                    Product Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-violet-500/20"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:ring-violet-400/20"
                      }`}
                    />
                  ) : (
                    <p
                      className={`px-4 py-3 rounded-xl ${
                        isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"
                      }`}
                    >
                      {product.name}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <Layers className="h-4 w-4 inline mr-2" />
                    Category
                  </label>
                  {isEditing ? (
                    <select
                      value={editForm.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white focus:border-violet-500 focus:ring-violet-500/20"
                          : "bg-white border-gray-200 text-gray-900 focus:border-violet-400 focus:ring-violet-400/20"
                      }`}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p
                      className={`px-4 py-3 rounded-xl ${
                        isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"
                      }`}
                    >
                      {product.category}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <DollarSign className="h-4 w-4 inline mr-2" />
                    Price
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) =>
                        handleInputChange("price", parseFloat(e.target.value))
                      }
                      step="0.01"
                      min="0"
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-violet-500/20"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:ring-violet-400/20"
                      }`}
                    />
                  ) : (
                    <p
                      className={`px-4 py-3 rounded-xl font-bold ${
                        isDark ? "bg-gray-800" : "bg-gray-50"
                      }`}
                    >
                      <span className={`bg-gradient-to-r ${
                        isDark
                          ? "from-emerald-400 to-green-500"
                          : "from-emerald-600 to-green-700"
                      } bg-clip-text text-transparent`}>
                        ${product.price}
                      </span>
                    </p>
                  )}
                </div>

                {/* Unit */}
                <div className="space-y-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <Tag className="h-4 w-4 inline mr-2" />
                    Unit
                  </label>
                  {isEditing ? (
                    <select
                      value={editForm.unit}
                      onChange={(e) =>
                        handleInputChange("unit", e.target.value)
                      }
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white focus:border-violet-500 focus:ring-violet-500/20"
                          : "bg-white border-gray-200 text-gray-900 focus:border-violet-400 focus:ring-violet-400/20"
                      }`}
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p
                      className={`px-4 py-3 rounded-xl ${
                        isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"
                      }`}
                    >
                      {product.unit}
                    </p>
                  )}
                </div>

                {/* Barcode */}
                <div className="space-y-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <Barcode className="h-4 w-4 inline mr-2" />
                    Barcode
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.barcode}
                      onChange={(e) =>
                        handleInputChange("barcode", e.target.value)
                      }
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-violet-500/20"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:ring-violet-400/20"
                      }`}
                    />
                  ) : (
                    <p
                      className={`px-4 py-3 rounded-xl font-mono ${
                        isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"
                      }`}
                    >
                      {product.barcode}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Management */}
          <Card
            className={`border-0 overflow-hidden ${
              isDark
                ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
                : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
            }`}
          >
            <CardHeader>
              <CardTitle
                className={`text-xl ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Inventory Management
              </CardTitle>
              <CardDescription
                className={isDark ? "text-gray-400" : "text-gray-600"}
              >
                {isEditing
                  ? "Adjust stock levels and thresholds"
                  : "Current stock and alert settings"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stock Quantity */}
                <div className="space-y-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <Package className="h-4 w-4 inline mr-2" />
                    Stock Quantity
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editForm.stock}
                      onChange={(e) =>
                        handleInputChange("stock", parseInt(e.target.value))
                      }
                      min="0"
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-violet-500/20"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:ring-violet-400/20"
                      }`}
                    />
                  ) : (
                    <p
                      className={`px-4 py-3 rounded-xl text-lg font-bold ${
                        isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"
                      }`}
                    >
                      {product.stock} {product.unit}
                    </p>
                  )}
                </div>

                {/* Low Stock Threshold */}
                <div className="space-y-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4 inline mr-2" />
                    Low Stock Threshold
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editForm.low_stock_threshold}
                      onChange={(e) =>
                        handleInputChange(
                          "low_stock_threshold",
                          parseInt(e.target.value)
                        )
                      }
                      min="0"
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-violet-500/20"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:ring-violet-400/20"
                      }`}
                    />
                  ) : (
                    <p
                      className={`px-4 py-3 rounded-xl ${
                        isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"
                      }`}
                    >
                      {product.low_stock_threshold} {product.unit}
                    </p>
                  )}
                </div>
              </div>

              {/* Stock Alert */}
              {(isEditing ? editForm.stock : product.stock) <
                (isEditing
                  ? editForm.low_stock_threshold
                  : product.low_stock_threshold) && (
                <div
                  className={`p-4 rounded-xl border-2 ${
                    isDark
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Low Stock Alert</p>
                      <p className="text-sm mt-1">
                        Current stock is below the threshold. Consider
                        reordering soon.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;