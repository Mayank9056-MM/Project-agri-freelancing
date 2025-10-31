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
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (
  //     !user &&
  //     window.location !== "/login" &&
  //     window.location !== "/register"
  //   ) {
  //     getCurrentUserApi()
  //       .then((res) => {
  //         localStorage.setItem("user", res.user);
  //         setUser(res.user);
  //       })
  //       .catch(() => setUser(null))
  //       .finally(() => setLoading(false));
  //   } else {
  //     setLoading(false);
  //   }
  // }, []);

  const login = async (credentials) => {
    const res = await loginApi(credentials);
    const userData = res.data;

    setUser(userData);

    return userData;
  };

  const register = async (credentials) => {
    console.log(credentials)
    const res = await registerApi(credentials);
    console.log(res)
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
