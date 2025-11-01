import React, { useContext } from "react";
import {
  Package,
  X,
  Edit2,
  Trash2,
  DollarSign,
  Hash,
  Tag,
  Box,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  BarChart3,
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

const ProductDetail = ({ product, onEdit, onDelete, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  if (!product) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "in-stock":
        return {
          bg: isDark
            ? "from-emerald-500/20 to-green-600/20"
            : "from-emerald-50 to-green-50",
          text: isDark ? "text-emerald-400" : "text-emerald-700",
          border: isDark ? "border-emerald-500/30" : "border-emerald-200",
        };
      case "low-stock":
        return {
          bg: isDark
            ? "from-amber-500/20 to-orange-600/20"
            : "from-amber-50 to-orange-50",
          text: isDark ? "text-amber-400" : "text-amber-700",
          border: isDark ? "border-amber-500/30" : "border-amber-200",
        };
      case "out-of-stock":
        return {
          bg: isDark
            ? "from-rose-500/20 to-red-600/20"
            : "from-rose-50 to-red-50",
          text: isDark ? "text-rose-400" : "text-rose-700",
          border: isDark ? "border-rose-500/30" : "border-rose-200",
        };
      default:
        return {
          bg: "from-gray-500/20 to-gray-600/20",
          text: "text-gray-400",
          border: "border-gray-500/30",
        };
    }
  };

  const getStockIcon = () => {
    if (product.stock === 0) return <AlertTriangle className="h-5 w-5" />;
    if (product.stock < product.reorderLevel)
      return <TrendingDown className="h-5 w-5" />;
    return <TrendingUp className="h-5 w-5" />;
  };

  const statusColors = getStatusColor(product.status);

  const InfoCard = ({ icon: Icon, label, value, gradient }) => (
    <Card
      className={`border-0 overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 to-white"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p
              className={`text-sm font-medium mb-1 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {label}
            </p>
            <p
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {value}
            </p>
          </div>
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient} backdrop-blur-sm`}
          >
            <Icon className="h-7 w-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card
        className={`w-full max-w-5xl max-h-[90vh] overflow-hidden border-0 ${
          isDark
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl"
            : "bg-gradient-to-br from-white via-gray-50 to-white shadow-2xl"
        }`}
      >
        <CardHeader
          className={`border-b ${
            isDark ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl ${
                  isDark
                    ? "bg-gradient-to-br from-violet-500/20 to-purple-600/20"
                    : "bg-gradient-to-br from-violet-50 to-purple-50"
                }`}
              >
                {product.image}
              </div>
              <div className="flex-1">
                <CardTitle
                  className={`text-3xl mb-2 bg-gradient-to-r ${
                    isDark
                      ? "from-white via-gray-200 to-gray-400"
                      : "from-gray-900 via-gray-700 to-gray-600"
                  } bg-clip-text text-transparent`}
                >
                  {product.name}
                </CardTitle>
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    SKU: {product.sku}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isDark
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {product.category}
                  </span>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold border bg-gradient-to-br ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                  >
                    <div className="flex items-center gap-1">
                      {getStockIcon()}
                      {product.status.replace("-", " ")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={onClose}
              className={`${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Key Metrics */}
            <div>
              <h3
                className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <BarChart3 className="h-5 w-5 text-violet-500" />
                Key Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InfoCard
                  icon={DollarSign}
                  label="Price"
                  value={`$${product.price}`}
                  gradient="from-emerald-500 to-green-600"
                />
                <InfoCard
                  icon={Box}
                  label="In Stock"
                  value={`${product.stock} units`}
                  gradient="from-blue-500 to-cyan-600"
                />
                <InfoCard
                  icon={TrendingUp}
                  label="Total Sold"
                  value={`${product.sold || 0} units`}
                  gradient="from-violet-500 to-purple-600"
                />
                <InfoCard
                  icon={AlertTriangle}
                  label="Reorder Level"
                  value={`${product.reorderLevel} units`}
                  gradient="from-amber-500 to-orange-600"
                />
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h3
                className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <Package className="h-5 w-5 text-violet-500" />
                Product Information
              </h3>
              <Card
                className={`border-0 overflow-hidden ${
                  isDark
                    ? "bg-gradient-to-br from-gray-800 to-gray-900"
                    : "bg-gradient-to-br from-gray-50 to-white"
                }`}
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Hash className="h-4 w-4 text-violet-500" />
                          <span
                            className={`text-sm font-semibold ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            SKU
                          </span>
                        </div>
                        <p
                          className={`text-base ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {product.sku}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="h-4 w-4 text-violet-500" />
                          <span
                            className={`text-sm font-semibold ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Category
                          </span>
                        </div>
                        <p
                          className={`text-base ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {product.category}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-violet-500" />
                          <span
                            className={`text-sm font-semibold ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Unit Price
                          </span>
                        </div>
                        <p
                          className={`text-2xl font-bold bg-gradient-to-r ${
                            isDark
                              ? "from-emerald-400 to-green-500"
                              : "from-emerald-600 to-green-700"
                          } bg-clip-text text-transparent`}
                        >
                          ${product.price}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Box className="h-4 w-4 text-violet-500" />
                          <span
                            className={`text-sm font-semibold ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Current Stock
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <p
                            className={`text-2xl font-bold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {product.stock}
                          </p>
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            units
                          </span>
                        </div>
                        {product.stock < product.reorderLevel &&
                          product.stock > 0 && (
                            <p className="text-sm text-amber-500 mt-2 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Low stock warning
                            </p>
                          )}
                        {product.stock === 0 && (
                          <p className="text-sm text-rose-500 mt-2 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Out of stock
                          </p>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-violet-500" />
                          <span
                            className={`text-sm font-semibold ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Reorder Level
                          </span>
                        </div>
                        <p
                          className={`text-base ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {product.reorderLevel} units
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 className="h-4 w-4 text-violet-500" />
                          <span
                            className={`text-sm font-semibold ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Total Sold
                          </span>
                        </div>
                        <p
                          className={`text-base ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {product.sold || 0} units
                        </p>
                      </div>
                    </div>
                  </div>

                  {product.description && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-violet-500" />
                        <span
                          className={`text-sm font-semibold ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Description
                        </span>
                      </div>
                      <p
                        className={`text-base leading-relaxed ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {product.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Stock Status Progress */}
            <div>
              <h3
                className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <TrendingUp className="h-5 w-5 text-violet-500" />
                Stock Level
              </h3>
              <Card
                className={`border-0 overflow-hidden ${
                  isDark
                    ? "bg-gradient-to-br from-gray-800 to-gray-900"
                    : "bg-gradient-to-br from-gray-50 to-white"
                }`}
              >
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Stock Status
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {product.stock} / {product.reorderLevel * 2}
                      </span>
                    </div>
                    <div
                      className={`h-4 rounded-full overflow-hidden ${
                        isDark ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          product.stock === 0
                            ? "bg-gradient-to-r from-rose-500 to-red-600"
                            : product.stock < product.reorderLevel
                            ? "bg-gradient-to-r from-amber-500 to-orange-600"
                            : "bg-gradient-to-r from-emerald-500 to-green-600"
                        }`}
                        style={{
                          width: `${Math.min(
                            (product.stock / (product.reorderLevel * 2)) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        0
                      </span>
                      <span
                        className={`${
                          isDark ? "text-amber-400" : "text-amber-600"
                        }`}
                      >
                        Reorder: {product.reorderLevel}
                      </span>
                      <span
                        className={`${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {product.reorderLevel * 2}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>

        <div
          className={`flex items-center justify-end gap-3 p-6 border-t ${
            isDark ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <Button
            onClick={() => onDelete(product)}
            className={`bg-gradient-to-r ${
              isDark
                ? "from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700"
                : "from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700"
            } shadow-lg`}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Product
          </Button>
          <Button
            onClick={() => onEdit(product)}
            className={`bg-gradient-to-r ${
              isDark
                ? "from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                : "from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
            } shadow-lg`}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Product
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetail;