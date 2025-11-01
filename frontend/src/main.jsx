import { StrictMode, useContext } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeContext, ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
import CustomToaster from "./components/customToaster";
import { ProductProvider } from "./context/ProductContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ProductProvider>
          <AuthProvider>
            <App />
            <CustomToaster />
          </AuthProvider>
        </ProductProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
