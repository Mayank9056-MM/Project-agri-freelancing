import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeContext, ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
import CustomToaster from "./components/customToaster";
import { ProductProvider } from "./context/ProductContext";
import { SaleProvider } from "./context/SaleContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <ProductProvider>
        <AuthProvider>
          <SaleProvider>
            <App />
          </SaleProvider>
          <CustomToaster />
        </AuthProvider>
      </ProductProvider>
    </ThemeProvider>
  </BrowserRouter>
);
