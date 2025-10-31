import api from "./api";

export const loginApi = async (credentials) => {
  try {
    console.log(credentials);
    const res = await api.post("user/login", credentials);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

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

export const getCurrentUserApi = async () => {
  try {
    const res = await api.get("user/");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const logoutApi = async () => {
  try {
    const res = await api.post("user/");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

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
