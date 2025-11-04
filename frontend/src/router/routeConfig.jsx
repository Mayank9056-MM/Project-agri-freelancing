import Dashboard from "@/pages/Dashboard/Dashboard";
import LowStock from "@/pages/Dashboard/LowStockList";
import POSPage from "@/pages/POS/POSPage";
import BulkUpload from "@/pages/Products/BulkUpload";
import ProductDetail from "@/pages/Products/ProductDetail";
import ProductForm from "@/pages/Products/ProductForm";
import ProductsList from "@/pages/Products/ProductsList";
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
    path:  "/products/edit/:sku",
    element: <ProductForm />,
    title: "Edit product",
    roles: ["admin"],
  },
  {
    path: "/products/delete/:sku",
    element: <ProductForm />,
    title: "Delete product",
    roles: ["admin"],
  },
  {
    path: "/product/:sku",
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
    path: "/settings",
    element: <SettingsPage />,
    title: "Settings",
    roles: ["admin"],
    // children: [
    //   {
    //     path: "users",
    //     element: <UserManagement />,
    //     roles: ["admin"],
    //   },
    // ],
  },
];
