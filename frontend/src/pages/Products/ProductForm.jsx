import React, { useState, useContext, useEffect } from "react";
import {
  Package,
  X,
  Save,
  AlertCircle,
  DollarSign,
  Hash,
  Tag,
  Layers,
  TrendingUp,
  Box,
  Upload,
  Image as ImageIcon,
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
import { useNavigate } from "react-router-dom";

const ProductForm = ({ product, onSave }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const navigate = useNavigate();

  const onCancel = () => navigate("/products");

  const [formData, setFormData] = useState({
    name: "",
    barcode: "",
    category: "",
    price: "",
    stock: "",
    unit: "",
    low_stock_threshold: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        barcode: product.barcode || "",
        category: product.category || "",
        price: product.price || "",
        stock: product.stock || "",
        unit: product.unit || "",
        low_stock_threshold: product.low_stock_threshold || "",
        image: null,
      });
      if (product.image) {
        setImagePreview(product.image);
      }
    }
  }, [product]);

  const categories = [
    "Electronics",
    "Audio",
    "Accessories",
    "Cables",
    "Computers",
    "Peripherals",
    "Storage",
    "Networking",
  ];

  const units = ["pcs", "kg", "g", "l", "ml", "m", "cm", "box", "pack", "set"];

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim() === "" ? "Product name is required" : "";
      case "barcode":
        return value.trim() === "" ? "Barcode is required" : "";
      case "category":
        return value === "" ? "Please select a category" : "";
      case "unit":
        return value === "" ? "Please select a unit" : "";
      case "price":
        return value === "" || isNaN(value) || parseFloat(value) <= 0
          ? "Valid price is required"
          : "";
      case "stock":
        return value === "" || isNaN(value) || parseInt(value) < 0
          ? "Valid stock quantity is required"
          : "";
      case "low_stock_threshold":
        return value === "" || isNaN(value) || parseInt(value) < 0
          ? "Valid threshold is required"
          : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      setErrors((prev) => ({ ...prev, image: "" }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (
        [
          "name",
          "barcode",
          "category",
          "price",
          "stock",
          "unit",
          "low_stock_threshold",
        ].includes(key)
      ) {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        name: true,
        barcode: true,
        category: true,
        price: true,
        stock: true,
        unit: true,
        low_stock_threshold: true,
      });
      return;
    }

    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append("name", formData.name.trim());
    submitData.append("barcode", formData.barcode.trim());
    submitData.append("category", formData.category);
    submitData.append("price", formData.price);
    submitData.append("stock", formData.stock);
    submitData.append("unit", formData.unit);
    submitData.append("low_stock_threshold", formData.low_stock_threshold);

    if (formData.image) {
      submitData.append("image", formData.image);
    }

    onSave(submitData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <Card
        className={`w-full max-w-4xl my-2 sm:my-4 overflow-hidden border-0 ${
          isDark
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl"
            : "bg-gradient-to-br from-white via-gray-50 to-white shadow-2xl"
        }`}
      >
        <CardHeader
          className={`border-b p-3 sm:p-4 lg:p-6 ${
            isDark ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <div className="flex items-start sm:items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle
                className={`text-lg sm:text-xl lg:text-2xl flex items-center gap-2 sm:gap-3 bg-gradient-to-r ${
                  isDark
                    ? "from-white via-gray-200 to-gray-400"
                    : "from-gray-900 via-gray-700 to-gray-600"
                } bg-clip-text text-transparent`}
              >
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-violet-500 flex-shrink-0" />
                <span className="truncate">
                  {product ? "Edit Product" : "Add New Product"}
                </span>
              </CardTitle>
              <CardDescription className="mt-1 text-xs sm:text-sm">
                {product
                  ? "Update product information and inventory details"
                  : "Fill in the details to add a new product"}
              </CardDescription>
            </div>
            <Button
              onClick={onCancel}
              className={`flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 p-0 ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <div>
          <CardContent className="p-3 sm:p-4 lg:p-6 max-h-[calc(100vh-180px)] sm:max-h-[calc(90vh-180px)] overflow-y-auto">
            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              {/* Basic Information */}
              <div>
                <h3
                  className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-violet-500 flex-shrink-0" />
                  <span>Basic Information</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Product Name */}
                  <div>
                    <label
                      className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">Product Name</span>
                      <span className="text-rose-500 flex-shrink-0">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter product name"
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                        touched.name && errors.name
                          ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                          : isDark
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-violet-500/20"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:ring-violet-400/20"
                      }`}
                    />
                    {touched.name && errors.name && (
                      <div className="flex items-start gap-1 mt-1.5 text-rose-500 text-xs sm:text-sm">
                        <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{errors.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Barcode */}
                  <div>
                    <label
                      className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <Hash className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">Barcode</span>
                      <span className="text-rose-500 flex-shrink-0">*</span>
                    </label>
                    <input
                      type="text"
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g., 1234567890123"
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                        touched.barcode && errors.barcode
                          ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                          : isDark
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-violet-500/20"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:ring-violet-400/20"
                      }`}
                    />
                    {touched.barcode && errors.barcode && (
                      <div className="flex items-start gap-1 mt-1.5 text-rose-500 text-xs sm:text-sm">
                        <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{errors.barcode}</span>
                      </div>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">Category</span>
                      <span className="text-rose-500 flex-shrink-0">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                        touched.category && errors.category
                          ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                          : isDark
                          ? "bg-gray-800 border-gray-700 text-white focus:border-violet-500 focus:ring-violet-500/20"
                          : "bg-white border-gray-200 text-gray-900 focus:border-violet-400 focus:ring-violet-400/20"
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {touched.category && errors.category && (
                      <div className="flex items-start gap-1 mt-1.5 text-rose-500 text-xs sm:text-sm">
                        <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{errors.category}</span>
                      </div>
                    )}
                  </div>

                  {/* Unit */}
                  <div>
                    <label
                      className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <Box className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">Unit</span>
                      <span className="text-rose-500 flex-shrink-0">*</span>
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                        touched.unit && errors.unit
                          ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                          : isDark
                          ? "bg-gray-800 border-gray-700 text-white focus:border-violet-500 focus:ring-violet-500/20"
                          : "bg-white border-gray-200 text-gray-900 focus:border-violet-400 focus:ring-violet-400/20"
                      }`}
                    >
                      <option value="">Select a unit</option>
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                    {touched.unit && errors.unit && (
                      <div className="flex items-start gap-1 mt-1.5 text-rose-500 text-xs sm:text-sm">
                        <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{errors.unit}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Image */}
              <div>
                <label
                  className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">Product Image</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {imagePreview && (
                    <div
                      className={`relative w-full sm:w-32 h-32 rounded-lg sm:rounded-xl overflow-hidden border-2 ${
                        isDark ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <label
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                        isDark
                          ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                          : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center py-2">
                        <Upload
                          className={`h-8 w-8 mb-2 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <p
                          className={`text-xs sm:text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Click to upload image
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            isDark ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          PNG, JPG, JPEG (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    {errors.image && (
                      <div className="flex items-start gap-1 mt-1.5 text-rose-500 text-xs sm:text-sm">
                        <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{errors.image}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div>
                <h3
                  className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0" />
                  <span>Pricing & Inventory</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* Price */}
                  <div>
                    <label
                      className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">Price ($)</span>
                      <span className="text-rose-500 flex-shrink-0">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                        touched.price && errors.price
                          ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                          : isDark
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-violet-500/20"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:ring-violet-400/20"
                      }`}
                    />
                    {touched.price && errors.price && (
                      <div className="flex items-start gap-1 mt-1.5 text-rose-500 text-xs sm:text-sm">
                        <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{errors.price}</span>
                      </div>
                    )}
                  </div>

                  {/* Stock */}
                  <div>
                    <label
                      className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <Box className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">Stock Quantity</span>
                      <span className="text-rose-500 flex-shrink-0">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0"
                      min="0"
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                        touched.stock && errors.stock
                          ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                          : isDark
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-violet-500/20"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:ring-violet-400/20"
                      }`}
                    />
                    {touched.stock && errors.stock && (
                      <div className="flex items-start gap-1 mt-1.5 text-rose-500 text-xs sm:text-sm">
                        <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{errors.stock}</span>
                      </div>
                    )}
                  </div>

                  {/* Low Stock Threshold */}
                  <div>
                    <label
                      className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">Low Stock Threshold</span>
                      <span className="text-rose-500 flex-shrink-0">*</span>
                    </label>
                    <input
                      type="number"
                      name="low_stock_threshold"
                      value={formData.low_stock_threshold}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0"
                      min="0"
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                        touched.low_stock_threshold &&
                        errors.low_stock_threshold
                          ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                          : isDark
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-violet-500/20"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:ring-violet-400/20"
                      }`}
                    />
                    {touched.low_stock_threshold &&
                      errors.low_stock_threshold && (
                        <div className="flex items-start gap-1 mt-1.5 text-rose-500 text-xs sm:text-sm">
                          <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 mt-0.5" />
                          <span className="leading-tight">
                            {errors.low_stock_threshold}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <div
            className={`flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-3 sm:p-4 lg:p-6 border-t ${
              isDark ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <Button
              type="button"
              onClick={onCancel}
              className={`w-full sm:w-auto text-sm sm:text-base ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className={`w-full sm:w-auto text-sm sm:text-base bg-gradient-to-r ${
                isDark
                  ? "from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                  : "from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              } shadow-lg`}
            >
              <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
              {product ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductForm;
