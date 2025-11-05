import api from "./api";

/**
 * Logs a user in using the provided credentials.
 *
 * @param {object} credentials - An object containing the user's credentials. Must contain the following:
 *   - email: The user's email address.
 *   - password: The user's password.
 * @returns {Promise<object>} A promise that resolves with the user object if the login is successful, or rejects with an error if the login fails.
 */
export const loginApi = async (credentials) => {
  try {
    console.log(credentials);
    const res = await api.post("user/login", credentials);
    return res;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Registers a new user in the database.
 *
 * @param {object} userData - An object containing the user's data. Must be a FormData object.
 * @returns {Promise<object>} A promise that resolves with the created user object.
 */
export const registerApi = async (userData) => {
  try {
    const res = await api.post("user/register", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Retrieves the currently logged in user from the database.
 *
 * @returns {Promise<object>} A promise that resolves with the user object if the user is logged in, or rejects with an error if the user is not logged in.
 */
export const getCurrentUserApi = async () => {
  try {
    const res = await api.get("user/");

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Logs the currently logged in user out of the application.
 *
 * @returns {Promise<object>} A promise that resolves with the user object if the logout is successful, or rejects with an error if the logout fails.
 */
export const logoutApi = async () => {
  try {
    const res = await api.post("user/");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Updates the avatar of the currently logged in user.
 *
 * @param {object} avatar - A FormData object containing the new avatar image of the user.
 * @returns {Promise<object>} A promise that resolves with the updated user object if the update is successful, or rejects with an error if the update fails.
 */
export const updateAvatarApi = async (avatar) => {
  try {
    const res = await api.patch("user/", avatar, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Retrieves all users from the database.
 *
 * @returns {Promise<object[]>} A promise that resolves with an array of user objects.
 */
export const getAllUsersApi = async () => {
  try {
    const res = await api.get("user/get");
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
