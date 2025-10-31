import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";

import { protectedRoutes } from "./routeConfig";
import ProtectedRoute from "@/components/layout/ProtectedRoutes";
import Register from "@/pages/Auth/Register";
import Login from "@/pages/Auth/Login";

export default function AppRouter() {
  return (
    <Routes>
      {/* 🟢 Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔒 Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {protectedRoutes.map(({ path, element, children }) => (
          <Route key={path} path={path} element={element}>
            {children &&
              children.map((child) => (
                <Route
                  key={child.path}
                  path={child.path}
                  element={child.element}
                />
              ))}
          </Route>
        ))}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
