import React, { useState, useContext, useEffect } from "react";
import {
  Package,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Barcode,
  DollarSign,
  Tag,
  Layers,
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
import { ProductContext } from "@/context/ProductContext";

const ProductDetails = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { sku } = useParams();

  const { getProductBySku } = useContext(ProductContext);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductBySku(sku);
        setProduct(res);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [sku, getProductBySku]);

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
    if (!prod) return "loading";
    if (prod.stock === 0) return "out-of-stock";
    if (prod.stock < prod.low_stock_threshold) return "low-stock";
    return "in-stock";
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading product details...</p>
      </div>
    );
  }

  const currentStatus = getStockStatus(product);

  return (
    <div className="min-h-screen p-6 space-y-6">
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
              Product Details
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Image & Status */}
        <div className="space-y-6">
          {/* Product Image */}
          <Card
            className={`border-0 overflow-hidden ${
              isDark
                ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
                : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
            }`}
          >
            <CardContent className="p-8 text-center">
              <div
                className={`w-full aspect-square rounded-3xl flex items-center justify-center text-9xl mb-6 ${
                  isDark
                    ? "bg-gradient-to-br from-violet-500/10 to-purple-600/10"
                    : "bg-gradient-to-br from-violet-50 to-purple-50"
                }`}
              >
                {product.image ? (
                  <span role="img" aria-label="product" className="text-8xl">
                   <img src={product?.image} alt="" />
                  </span>
                ) : (
                  <ImageIcon className="h-20 w-20 text-gray-400" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stock Status */}
          <Card
            className={`border-0 overflow-hidden ${
              isDark
                ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
                : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
            }`}
          >
            <CardHeader>
              <CardTitle
                className={`text-lg ${isDark ? "text-white" : "text-gray-900"}`}
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
                  {getStockIcon(product)}
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
                    {product.stock} {product.unit}
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
                    {product.low_stock_threshold} {product.unit}
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
          {/* Basic Info */}
          <Card
            className={`border-0 overflow-hidden ${
              isDark
                ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
                : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
            }`}
          >
            <CardHeader>
              <CardTitle
                className={`text-xl ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Basic Information
              </CardTitle>
              <CardDescription
                className={isDark ? "text-gray-400" : "text-gray-600"}
              >
                Essential product details
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailField label="Product Name" icon={<Package />} value={product.name} isDark={isDark} />
                <DetailField label="Category" icon={<Layers />} value={product.category} isDark={isDark} />
                <DetailField label="Price" icon={<DollarSign />} value={`$${product.price}`} isDark={isDark} />
                <DetailField label="Unit" icon={<Tag />} value={product.unit} isDark={isDark} />
                <DetailField label="Barcode" icon={<Barcode />} value={product.barcode} isDark={isDark} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// 🔹 Small reusable field component for clean design
const DetailField = ({ label, icon, value, isDark }) => (
  <div className="space-y-2">
    <label
      className={`block text-sm font-medium ${
        isDark ? "text-gray-300" : "text-gray-700"
      }`}
    >
      {icon} <span className="ml-2">{label}</span>
    </label>
    <p
      className={`px-4 py-3 rounded-xl ${
        isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {value}
    </p>
  </div>
);

export default ProductDetails;
