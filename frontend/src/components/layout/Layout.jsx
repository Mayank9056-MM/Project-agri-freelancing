import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Moon,
  Sun,
  Menu,
  X,
  Package,
  ShoppingCart,
  Plus,
  Users,
  Bell,
  LogOut,
  BarChart3,
  AlertCircle,
  FileText,
  Upload,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { ThemeContext } from "@/context/ThemeContext";
import toast from "react-hot-toast";
import { ProductContext } from "@/context/ProductContext";
import { protectedRoutes } from "@/router/routeConfig";


const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout, user } = useContext(AuthContext);
  const userRole = user?.role;
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [lowStockCount, setLowStockCount] = useState(0);
  const { getLowStockProducts } = useContext(ProductContext);

  useEffect(() => {
    // getLowStockProducts()
    //   .then((data) => setLowStockCount(data?.count))
    //   .catch((error) => console.log(error));
  }, []);

  const themeChange = async () => toggleTheme();
  const isDark = theme === "dark";

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const NavItem = ({ icon: Icon, label, path, badge }) => {
    const isActive = location.pathname === path;




    return (
      <div>
        <button
          onClick={() => {
            navigate(path);
            setMobileMenuOpen(false);
          }}
          className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full ${
            isActive
              ? isDark
                ? "bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-lg shadow-gray-900/50"
                : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 shadow-md"
              : isDark
              ? "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Icon className="h-5 w-5" />
          <span className="font-medium">{label}</span>
          {badge && (
            <span className="absolute right-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </button>
      </div>
    );
  };

      const sidebarMenu = protectedRoutes.filter((route) =>
      route.roles?.includes(userRole)
    );

    const getIcon = (title) => {
  switch (title) {
    case "Dashboard":
      return BarChart3;
    case "POS / Billing":
      return ShoppingCart;
    case "Products":
      return Package;
    case "Bulk Upload":
      return Upload;
    case "Sales Report":
      return FileText;
    case "Low Stock":
      return AlertCircle;
    case "User Management":
      return Users;
    case "Scan":
      return Camera;
    default:
      return FileText;
  }
};

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black"
          : "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50"
      }`}
    >
      {/* Top Navbar */}
      <nav
        className={`sticky top-0 z-40 border-b ${
          isDark
            ? "bg-gray-900/90 border-gray-800 backdrop-blur-2xl shadow-2xl shadow-black/30"
            : "bg-white/90 border-gray-200 backdrop-blur-2xl shadow-lg"
        }`}
      >
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg cursor-pointer ${
                    isDark
                      ? "from-violet-600 to-purple-700 shadow-violet-900/50"
                      : "from-violet-500 to-purple-600 shadow-violet-500/30"
                  }`}
                  onClick={() => navigate("/")}
                >
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <span
                    className={`text-xl font-bold block bg-gradient-to-r cursor-pointer ${
                      isDark
                        ? "from-white to-gray-300"
                        : "from-gray-900 to-gray-600"
                    } bg-clip-text text-transparent`}
                    onClick={() => navigate("/")}
                  >
                    StockFlow
                  </span>
                  <span
                    className={`text-xs ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Inventory System
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative group">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-r from-rose-500 to-red-600 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={themeChange}
                className="hover:scale-110 transition-transform"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              <div
                className={`hidden sm:flex items-center gap-3 ml-2 pl-3 border-l ${
                  isDark ? "border-gray-800" : "border-gray-200"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-md ${
                    isDark
                      ? "from-gray-800 to-gray-700"
                      : "from-gray-200 to-gray-300"
                  }`}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="User" />
                  ) : (
                    <Users className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <span
                    className={`text-sm font-semibold block ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {user?.role === "admin" ? "Admin" : "Cashier"}
                  </span>
                  <span
                    className={`text-xs flex items-center gap-1 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside
          className={`hidden lg:block w-64 min-h-screen border-r ${
            isDark
              ? "bg-gray-900/50 border-gray-800 backdrop-blur-xl"
              : "bg-white/50 border-gray-200 backdrop-blur-xl"
          }`}
        >
          <div className="p-4 space-y-2">
            <div
              className={`mb-4 p-3 rounded-xl ${
                isDark ? "bg-gray-800/50" : "bg-gray-100"
              }`}
            >
              <p
                className={`text-xs font-medium mb-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Quick Actions
              </p>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  className={`flex-1 bg-gradient-to-r ${
                    isDark
                      ? "from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                      : "from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                  } shadow-lg`}
                  onClick={() => navigate("/products/add")}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  className={`flex-1 bg-gradient-to-r ${
                    isDark
                      ? "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                      : "from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                  } shadow-lg`}
                  onClick={() => navigate("/scan")}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {sidebarMenu.map((route) => (
              <NavItem
                key={route.path}
                icon={getIcon(route.title)}
                label={route.title}
                path={route.path}
                badge={route.path === "/low-stock" ? lowStockCount : undefined}
              />
            ))}

            <div className="pt-6 mt-6 border-t border-gray-800">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  isDark
                    ? "text-red-400 hover:bg-red-950/50 hover:text-red-300"
                    : "text-red-600 hover:bg-red-50"
                }`}
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div
            className={`fixed inset-0 z-30 lg:hidden ${
              isDark ? "bg-black/70" : "bg-gray-900/50"
            } backdrop-blur-sm`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <aside
              className={`w-64 h-full ${
                isDark ? "bg-gray-900" : "bg-white"
              } shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 space-y-2">
                <NavItem icon={BarChart3} label="Dashboard" path="/" />
                <NavItem
                  icon={ShoppingCart}
                  label="POS / Billing"
                  path="/pos"
                />
                <NavItem icon={Package} label="Products" path="/products" />
                <NavItem
                  icon={Upload}
                  label="Bulk Upload"
                  path="/bulk-upload"
                />
                <NavItem icon={FileText} label="Sales Reports" path="/sales" />
                <NavItem
                  icon={AlertCircle}
                  label="Low Stock"
                  path="/low-stock"
                  badge="12"
                />
                {userRole === "admin" && (
                  <NavItem icon={Users} label="User Management" path="/users" />
                )}
                <div className="pt-6 mt-6 border-t border-gray-800">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 ${
                      isDark
                        ? "text-red-400 hover:bg-red-950/50"
                        : "text-red-600 hover:bg-red-50"
                    }`}
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
