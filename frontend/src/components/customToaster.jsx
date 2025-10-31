// src/components/CustomToaster.jsx
import { useContext } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeContext } from "@/context/ThemeContext";

export default function CustomToaster() {
  const { theme } = useContext(ThemeContext);

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        style: {
          background: theme === "dark" ? "#333" : "#fff",
          color: theme === "dark" ? "#fff" : "#000",
          border: "1px solid rgba(255,255,255,0.1)",
        },
      }}
    />
  );
}
