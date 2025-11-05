import React, { useContext, useEffect, useState } from "react";
import {
  Camera,
  Scan,
  Plus,
  Minus,
  Trash2,
  DollarSign,
  CreditCard,
  Smartphone,
  Receipt,
  User,
  ShoppingBag,
  Search,
  X,
  Check,
  Percent,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeContext } from "@/context/ThemeContext";
import { SaleContext } from "@/context/SaleContext";
import { toast } from "react-hot-toast";
import { generateInvoice } from "@/utils/generateInvoice";
import { ProductContext } from "@/context/ProductContext";

const POSPage = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [cart, setCart] = useState([]);

  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const tax = (subtotal - discountAmount) * 0.18; // 18% tax
  const total = subtotal - discountAmount + tax;

  useEffect(() => {
    const savedCart = localStorage.getItem("pos_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("pos_cart", JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (id, change) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(item.quantity + change, item.stock)
              ),
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removed");
  };
  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setCustomerName("");
  };

  const { createSale } = useContext(SaleContext);
  const { products, getAllProducts, loading } = useContext(ProductContext);

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleCheckout = async (paymentMethod) => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }

    try {
      const items = cart.map((item) => ({
        sku: item.sku,
        name: item.name,
        qty: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      }));

      const payload = {
        items,
        paymentMethod,
        paymentStatus: "paid",
      };

      // Call API through context
      const res = await createSale(payload);
      console.log(res);

      toast.success(`Sale successful! Sale ID: ${res.saleId}`);

      // Prepare sale data for invoice
      const saleData = {
        saleId: res.saleId,
        items,
        subtotal: items.reduce((s, i) => s + i.subtotal, 0),
        discount,
        tax: (subtotal - (subtotal * discount) / 100) * 0.18,
        total,
        paymentMethod,
        customerName,
      };

      // Generate invoice PDF
      generateInvoice(saleData);

      clearCart();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Sale failed");
    }
  };

  const quickDiscounts = [5, 10, 15, 20];

const addToCart = (product) => {
  setCart((prevCart) => {
    const existingItem = prevCart.find((item) => item.sku === product.sku);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        setTimeout(() => toast.error(`Only ${product.stock} items in stock`), 0);
        return prevCart;
      }

      setTimeout(() => toast.success(`Quantity updated for ${product.name}`), 0);
      return prevCart.map((item) =>
        item.sku === product.sku
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    setTimeout(() => toast.success(`${product.name} added to cart`), 0);

    return [
      ...prevCart,
      {
        id: product._id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: 1,
        stock: product.stock,
      },
    ];
  });
};


  const filteredProducts = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${
              isDark
                ? "from-white via-gray-200 to-gray-400"
                : "from-gray-900 via-gray-700 to-gray-600"
            } bg-clip-text text-transparent`}
          >
            Point of Sale
          </h1>
          <p
            className={`mt-2 flex items-center gap-2 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            Quick checkout and billing system
          </p>
        </div>
        <Button
          onClick={clearCart}
          variant="outline"
          className={`${
            isDark
              ? "border-gray-700 hover:bg-gray-800"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Product Search & Cart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search & Scan */}
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
                  isDark
                    ? "from-white to-gray-400"
                    : "from-gray-900 to-gray-600"
                } bg-clip-text text-transparent`}
              >
                Add Products
              </CardTitle>
              <CardDescription>
                Scan barcode or search by name/SKU
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search
                    className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 ${
                      isDark
                        ? "bg-gray-800/50 border-gray-700 focus:border-violet-500"
                        : "bg-gray-100 border-gray-200 focus:border-violet-400"
                    }`}
                  />
                </div>
                <Button
                  className={`bg-gradient-to-r ${
                    isDark
                      ? "from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                      : "from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                  } shadow-lg`}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Scan
                </Button>
              </div>

              {/* Quick Add Products */}
              <div className="grid grid-cols-2 gap-3">
                {loading ? (
                  <p className="text-center text-gray-500">
                    Loading products...
                  </p>
                ) : (
                  filteredProducts?.slice(0, 8).map((product) => (
                    <button
                      key={product._id}
                      onClick={() => addToCart(product)}
                      className={`p-3 rounded-xl text-left transition-all hover:scale-[1.02] ${
                        isDark
                          ? "bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50"
                          : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <p
                        className={`font-semibold text-sm ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {product.name}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p
                          className={`text-sm font-bold ${
                            isDark ? "text-emerald-400" : "text-emerald-600"
                          }`}
                        >
                          ₹{product.price}
                        </p>
                        <span
                          className={`text-xs ${
                            isDark ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          Stock: {product.stock}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shopping Cart */}
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
                  isDark
                    ? "from-white to-gray-400"
                    : "from-gray-900 to-gray-600"
                } bg-clip-text text-transparent`}
              >
                Shopping Cart
              </CardTitle>
              <CardDescription>
                {cart.length} {cart.length === 1 ? "item" : "items"} in cart
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div
                  className={`py-12 text-center rounded-xl ${
                    isDark ? "bg-gray-800/30" : "bg-gray-50"
                  }`}
                >
                  <ShoppingBag
                    className={`h-12 w-12 mx-auto mb-3 ${
                      isDark ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Cart is empty. Add products to begin.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl transition-all ${
                        isDark
                          ? "bg-gray-800/50 hover:bg-gray-800"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p
                            className={`font-semibold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.name}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              isDark ? "text-gray-500" : "text-gray-500"
                            }`}
                          >
                            SKU: {item.sku}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className={`h-8 w-8 ${
                            isDark
                              ? "text-red-400 hover:bg-red-950/50"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, -1)}
                            className={`h-8 w-8 ${
                              isDark
                                ? "border-gray-700 hover:bg-gray-700"
                                : "border-gray-300 hover:bg-gray-200"
                            }`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span
                            className={`min-w-[2rem] text-center font-semibold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, 1)}
                            className={`h-8 w-8 ${
                              isDark
                                ? "border-gray-700 hover:bg-gray-700"
                                : "border-gray-300 hover:bg-gray-200"
                            }`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p
                            className={`text-xs ₹{
                              isDark ? "text-gray-500" : "text-gray-500"
                            }`}
                          >
                            ₹{item.price} each
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Payment */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card
            className={`border-0 overflow-hidden ${
              isDark
                ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
                : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
            }`}
          >
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 bg-gradient-to-r ${
                  isDark
                    ? "from-white to-gray-400"
                    : "from-gray-900 to-gray-600"
                } bg-clip-text text-transparent`}
              >
                <User className="h-5 w-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Customer name (optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={`${
                  isDark
                    ? "bg-gray-800/50 border-gray-700 focus:border-violet-500"
                    : "bg-gray-100 border-gray-200 focus:border-violet-400"
                }`}
              />
            </CardContent>
          </Card>

          {/* Discount */}
          <Card
            className={`border-0 overflow-hidden ${
              isDark
                ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
                : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
            }`}
          >
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 bg-gradient-to-r ${
                  isDark
                    ? "from-white to-gray-400"
                    : "from-gray-900 to-gray-600"
                } bg-clip-text text-transparent`}
              >
                <Percent className="h-5 w-5" />
                Discount
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                {quickDiscounts.map((d) => (
                  <Button
                    key={d}
                    variant="outline"
                    size="sm"
                    onClick={() => setDiscount(d)}
                    className={`flex-1 ${
                      discount === d
                        ? isDark
                          ? "bg-violet-600 border-violet-600 text-white"
                          : "bg-violet-500 border-violet-500 text-white"
                        : isDark
                        ? "border-gray-700 hover:bg-gray-800"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {d}%
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                placeholder="Custom discount %"
                value={discount || ""}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className={`${
                  isDark
                    ? "bg-gray-800/50 border-gray-700 focus:border-violet-500"
                    : "bg-gray-100 border-gray-200 focus:border-violet-400"
                }`}
              />
            </CardContent>
          </Card>

          {/* Bill Summary */}
          <Card
            className={`border-0 overflow-hidden ${
              isDark
                ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
                : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
            }`}
          >
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 bg-gradient-to-r ${
                  isDark
                    ? "from-white to-gray-400"
                    : "from-gray-900 to-gray-600"
                } bg-clip-text text-transparent`}
              >
                <Receipt className="h-5 w-5" />
                Bill Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Subtotal
                  </span>
                  <span
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-emerald-500">
                      Discount ({discount}%)
                    </span>
                    <span className="font-semibold text-emerald-500">
                      -₹{discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Tax (18%)
                  </span>
                  <span
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ₹{tax.toFixed(2)}
                  </span>
                </div>
                <div
                  className={`pt-3 border-t ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Total
                    </span>
                    <span
                      className={`text-2xl font-bold bg-gradient-to-r ${
                        isDark
                          ? "from-emerald-400 to-green-500"
                          : "from-emerald-600 to-green-700"
                      } bg-clip-text text-transparent`}
                    >
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Buttons */}
              <div className="space-y-2 pt-2">
                <Button
                  disabled={cart.length === 0}
                  onClick={() => handleCheckout("upi")}
                  className={`w-full h-12 bg-gradient-to-r ${
                    isDark
                      ? "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                      : "from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                  } shadow-lg text-base font-semibold`}
                >
                  <Smartphone className="h-5 w-5 mr-2" />
                  UPI Payment
                </Button>
                <Button
                  disabled={cart.length === 0}
                  onClick={() => handleCheckout("card")}
                  className={`w-full h-12 bg-gradient-to-r ${
                    isDark
                      ? "from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                      : "from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                  } shadow-lg text-base font-semibold`}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Card Payment
                </Button>
                <Button
                  disabled={cart.length === 0}
                  onClick={() => handleCheckout("cash")}
                  className={`w-full h-12 bg-gradient-to-r ${
                    isDark
                      ? "from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                      : "from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                  } shadow-lg text-base font-semibold`}
                >
                  <DollarSign className="h-5 w-5 mr-2" />
                  Cash Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default POSPage;
