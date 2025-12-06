import ScanPage from "@/pages/barcode/ScanPage";
import Dashboard from "@/pages/Dashboard/Dashboard";
import LowStock from "@/pages/Dashboard/LowStockList";
import POSPage from "@/pages/POS/POSPage";
import SuccessPage from "@/pages/POS/SuccessPage";
import BulkUpload from "@/pages/Products/BulkUpload";
import DeleteProduct from "@/pages/Products/DeleteProduct";
import ProductDetail from "@/pages/Products/ProductDetail";
import ProductForm from "@/pages/Products/ProductForm";
import ProductsList from "@/pages/Products/ProductsList";
import RestockPage from "@/pages/Products/RestorePage";
import SalesReport from "@/pages/Sales/SalesReport";
import SettingsPage from "@/pages/Settings/SettingsPage";
import UserManagement from "@/pages/Settings/UserManagement";

// 🟢 Public routes (no login required)
export const publicRoutes = [
  { path: "/login", element: "Login" },
  { path: "/signup", element: "Signup" },
];

// 🔒 Protected routes (need login)
export const protectedRoutes = [
  {
    path: "/",
    element: <Dashboard />,
    title: "Dashboard",
    roles: ["admin", "cashier"], // both can access
  },
  {
    path: "/products",
    element: <ProductsList />,
    title: "Products",
    roles: ["admin"],
  },
  {
    path: "/products/add",
    element: <ProductForm />,
    title: "Add Product",
    roles: ["admin"],
  },
  {
    path: "/products/edit/:sku",
    element: <ProductForm />,
    title: "Edit product",
    roles: ["admin"],
  },
  {
    path: "/products/delete/:sku",
    element: <DeleteProduct />,
    title: "Delete product",
    roles: ["admin"],
  },
  {
    path: "/products/:sku",
    element: <ProductDetail />,
    title: "Product Details",
    roles: ["admin"],
  },
  {
    path: "/pos",
    element: <POSPage />,
    title: "Point of Sale",
    roles: ["cashier", "admin"],
  },
  {
    path: "/success",
    element: <SuccessPage />,
    title: "Success Page",
    role: ["cashier,admin"],
  },
  {
    path: "/bulk-upload",
    element: <BulkUpload />,
    title: "Bulk Upload",
    roles: ["admin"],
  },
  {
    path: "/low-stock",
    element: <LowStock />,
    title: "Low Stock",
    roles: ["admin"],
  },
  {
    path: "/sales",
    element: <SalesReport />,
    title: "Sales Report",
    roles: ["admin"],
  },
  {
    path: "/users",
    element: <UserManagement />,
    title: "Users",
    roles: ["admin"],
  },
  {
    path: "/scan",
    element: <ScanPage />,
    title: "Scan",
    roles: ["admin", "cashier"],
  },
  {
    path: "/settings",
    element: <SettingsPage />,
    title: "Settings",
    roles: ["admin"],
  },
  {
    path: "/restock/:sku",
    element: <RestockPage />,
    title: "Restock",
    roles: ["admin"]
  }
];

export const adminRoutes = [
  {
    path: "/",
    element: <Dashboard />,
    title: "Dashboard",
    roles: ["admin", "cashier"], // both can access
  },
  {
    path: "/pos",
    element: <POSPage />,
    title: "POS / Billing",
    roles: ["cashier", "admin"],
  },
  {
    path: "/products",
    element: <ProductsList />,
    title: "Products",
    roles: ["admin"],
  },
  {
    path: "/bulk-upload",
    element: <BulkUpload />,
    title: "Bulk Upload",
    roles: ["admin"],
  },
  {
    path: "/sales",
    element: <SalesReport />,
    title: "Sales Report",
    roles: ["admin"],
  },
  {
    path: "/low-stock",
    element: <LowStock />,
    title: "Low Stock",
    roles: ["admin"],
  },

  {
    path: "/users",
    element: <UserManagement />,
    title: "Users",
    roles: ["admin"],
  },
];
