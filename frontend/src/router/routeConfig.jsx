import Dashboard from "@/pages/Dashboard/Dashboard";
import POSPage from "@/pages/POS/POSPage";
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
    path: "/products/:id",
    element: <ProductDetail />,
    title: "Product Details",
    roles: ["admin"]
  },
  {
    path: "/pos",
    element: <POSPage />,
    title: "Point of Sale",
    roles: ["cashier", "admin"],
  },
  {
    path: "/sales",
    element: <SalesReport />,
    title: "Sales Report",
    roles: ["admin"],
  },
  {
    path: "/settings",
    element: <SettingsPage />,
    title: "Settings",
    roles: ["admin"],
    children: [
      {
        path: "users",
        element: <UserManagement />,
        roles: ["admin"],
      },
    ],
  },
];
