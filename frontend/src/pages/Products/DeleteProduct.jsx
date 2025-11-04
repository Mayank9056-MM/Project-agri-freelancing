import React, { useState, useContext, useEffect } from "react";
import {
  Package,
  X,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowLeft,
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
import toast from "react-hot-toast";

const DeleteProduct = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(true);
  const [productData, setProductData] = useState(null);
  const [confirmText, setConfirmText] = useState("");

  const navigate = useNavigate();
  const { sku } = useParams();

  const { deleteProduct, getProductBySku } = useContext(ProductContext);

  useEffect(() => {
    if (sku) {
      const fetchProduct = async () => {
        setFetchingProduct(true);
        try {
          const data = await getProductBySku(sku);
          setProductData(data);
        } catch (err) {
          console.error(err);
          toast.error("Could not load product details");
          navigate("/products");
        } finally {
          setFetchingProduct(false);
        }
      };
      fetchProduct();
    }
  }, [sku, getProductBySku, navigate]);

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== "delete") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    setLoading(true);
    try {
      await deleteProduct(sku);
      toast.success("Product deleted successfully");
      navigate("/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

//   if (fetchingProduct) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//         <Card
//           className={`w-full max-w-md ${
//             isDark
//               ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
//               : "bg-gradient-to-br from-white via-gray-50 to-white"
//           }`}
//         >
//           <CardContent className="p-8 flex flex-col items-center justify-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent mb-4"></div>
//             <p
//               className={`text-sm ${
//                 isDark ? "text-gray-400" : "text-gray-600"
//               }`}
//             >
//               Loading product details...
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <Card
        className={`w-full max-w-2xl my-4 overflow-hidden border-0 ${
          isDark
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl"
            : "bg-gradient-to-br from-white via-gray-50 to-white shadow-2xl"
        }`}
      >
        {/* Header */}
        <CardHeader
          className={`border-b p-6 ${
            isDark ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle
                className={`text-xl lg:text-2xl flex items-center gap-3 bg-gradient-to-r ${
                  isDark
                    ? "from-rose-400 via-red-400 to-orange-400"
                    : "from-rose-600 via-red-600 to-orange-600"
                } bg-clip-text text-transparent`}
              >
                <AlertTriangle className="h-6 w-6 text-rose-500 flex-shrink-0" />
                <span>Delete Product</span>
              </CardTitle>
              <CardDescription className="mt-2 text-sm">
                This action cannot be undone. Please review carefully.
              </CardDescription>
            </div>
            <Button
              onClick={handleCancel}
              className={`flex-shrink-0 h-10 w-10 p-0 ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Warning Alert */}
          <div
            className={`relative overflow-hidden rounded-xl p-5 border-2 ${
              isDark
                ? "bg-gradient-to-br from-rose-950/40 to-orange-950/40 border-rose-800/50"
                : "bg-gradient-to-br from-rose-50 to-orange-50 border-rose-200"
            }`}
          >
            <div className="flex gap-4">
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  isDark
                    ? "bg-rose-900/50 text-rose-400"
                    : "bg-rose-100 text-rose-600"
                }`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4
                  className={`font-semibold mb-1 ${
                    isDark ? "text-rose-300" : "text-rose-900"
                  }`}
                >
                  Warning: Permanent Deletion
                </h4>
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-rose-200/80" : "text-rose-800/80"
                  }`}
                >
                  Once deleted, this product and all its associated data will be
                  permanently removed from your inventory. This action cannot be
                  reversed.
                </p>
              </div>
            </div>
          </div>

          {/* Product Details Card */}
          {productData && (
            <div
              className={`rounded-xl border-2 overflow-hidden ${
                isDark
                  ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700"
                  : "bg-gradient-to-br from-gray-50 to-white border-gray-200"
              }`}
            >
              <div
                className={`px-5 py-3 border-b ${
                  isDark ? "border-gray-700 bg-gray-800/30" : "border-gray-200 bg-gray-100/50"
                }`}
              >
                <h3
                  className={`text-sm font-semibold flex items-center gap-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <Info className="h-4 w-4 text-violet-500" />
                  Product Information
                </h3>
              </div>
              <div className="p-5 space-y-4">
                {/* Product Image and Basic Info */}
                <div className="flex gap-4">
                  {productData.image && (
                    <div
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        isDark ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={productData.image}
                        alt={productData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                      <Package
                        className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                          isDark ? "text-violet-400" : "text-violet-600"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-semibold text-lg truncate ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {productData.name}
                        </p>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          SKU: {productData.sku}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Details Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/50">
                  <div>
                    <p
                      className={`text-xs font-medium mb-1 ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      Category
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {productData.category}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs font-medium mb-1 ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      Price
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        isDark ? "text-emerald-400" : "text-emerald-600"
                      }`}
                    >
                      ${productData.price}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs font-medium mb-1 ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      Stock
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {productData.stock} {productData.unit}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs font-medium mb-1 ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      Low Stock Alert
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {productData.low_stock_threshold} {productData.unit}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Input */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <CheckCircle2 className="h-4 w-4 text-violet-500" />
              <span>Confirm Deletion</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder='Type "DELETE" to confirm'
              className={`w-full px-4 py-3 text-base rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-rose-500 focus:ring-rose-500/20"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-rose-400 focus:ring-rose-400/20"
              }`}
            />
            <p
              className={`text-xs mt-2 ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Type <span className="font-semibold">DELETE</span> in capital
              letters to enable the delete button
            </p>
          </div>
        </CardContent>

        {/* Footer Actions */}
        <div
          className={`flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 p-6 border-t ${
            isDark ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <Button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className={`w-full sm:w-auto ${
              isDark
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
            }`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={loading || confirmText.toLowerCase() !== "delete"}
            className={`w-full sm:w-auto bg-gradient-to-r ${
              isDark
                ? "from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700"
                : "from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700"
            } text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                Deleting...
              </span>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Product
              </>
             )} 
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DeleteProduct;