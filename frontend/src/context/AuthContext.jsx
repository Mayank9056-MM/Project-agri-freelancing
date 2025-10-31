import {
  getCurrentUserApi,
  loginApi,
  logoutApi,
  registerApi,
} from "@/services/authService";
import { createContext, useState, useEffect } from "react";
// import { getCurrentUser } from "@/services/authService";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          const res = await getCurrentUserApi();
          const currentUser = res.user;
          if (currentUser) {
            setUser(currentUser);

            localStorage.setItem("user", JSON.stringify(currentUser));
          }
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    console.log("Updated user:", user);
  }, [user]);

  const login = async (credentials) => {
    const res = await loginApi(credentials);
    const userData = res.data;

    setUser(userData);

    return userData;
  };

  const register = async (credentials) => {
    console.log(credentials);
    const res = await registerApi(credentials);
    console.log(res);
    const userData = res.data;

    return userData;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
