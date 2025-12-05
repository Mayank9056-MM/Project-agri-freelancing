import {
  getAllUsersApi,
  getCurrentUserApi,
  loginApi,
  logoutApi,
  registerApi,
} from "@/services/authService";
import { createContext, useState, useEffect } from "react";
// import { getCurrentUser } from "@/services/authService";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

/**
 * Provides the authentication context to the application.
 * It fetches the current user from local storage or the API on mount and sets the user state accordingly.
 * It also provides the login, logout, and register functions to manipulate the user state.
 * The context value includes the user state, a setter for the user state, the login function, the logout function, the register function, and a boolean indicating whether the user is authenticated.
 * The context value is updated whenever the user state changes.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
    /**
     * Fetches the current user from local storage or the API.
     * If the user is found in local storage, it is parsed and set as the current user.
     * If the user is not found in local storage, the API is called to retrieve the current user.
     * If the API call is successful, the current user is set and stored in local storage.
     * If the API call fails, the current user is set to null and the user is removed from local storage.
     * Finally, the loading state is set to false.
     */
  //   const fetchUser = async () => {
  //     try {
  //       setLoading(true)
  //       const savedUser = localStorage.getItem("user");

  //       if (savedUser) {
  //         setUser(JSON.parse(savedUser));
  //       } else {
  //         const res = await getCurrentUserApi();
  //         const currentUser = res.user;
  //         if (currentUser) {
  //           setUser(currentUser);

  //           localStorage.setItem("user", JSON.stringify(currentUser));
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch current user:", err);
  //       setUser(null);
  //       localStorage.removeItem("user");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  useEffect(() => {
  const initAuth = async () => {
    setLoading(true);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await getCurrentUserApi();
      setUser(res.user);

      localStorage.setItem("user", JSON.stringify(res.user));
    } catch (err) {
      console.error("Token invalid -> Logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  initAuth();
}, []);


  useEffect(() => {
    console.log("Updated user:", user);
  }, [user]);


/**
 * Logs in a user to the application.
 *
 * @param {object} credentials - An object containing the following:
 *   - email: The email address of the user.
 *   - password: The password of the user.
 * @returns {Promise<object>} A promise that resolves with the logged in user data.
 * @throws {Error} - if something goes wrong while logging in the user
 */
 const login = async (credentials) => {
  const res = await loginApi(credentials);

  const { user, accessToken } = res.data;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("user", JSON.stringify(user));

  setUser(user);

  return user;
};


  /**
   * Registers a new user to the application.
   *
   * @param {object} credentials - An object containing the following:
   *   - email: The email address of the user.
   *   - password: The password of the user.
   *   - name: The name of the user.
   *   - role: The role of the user (defaults to "admin").
   * @returns {Promise<object>} A promise that resolves with the registered user data.
   * @throws {Error} - if something goes wrong while registering the user
   */
  const register = async (credentials) => {
    console.log(credentials);
    const res = await registerApi(credentials);
    console.log(res);
    const userData = res.data;

    return userData;
  };

  /**
   * Logs out the current user and removes their credentials from local storage.
   *
   * @returns {Promise<void>} A promise that resolves when the user has been logged out.
   */
const logout = async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  setUser(null);
};


  const getAllUsers = async () => {
    try {
      const data = await getAllUsersApi();
      return data.users;
    } catch (error) {
      console.log(error);
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
    getAllUsers,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
