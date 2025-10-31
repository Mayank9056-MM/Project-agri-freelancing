import api from "./api";

export const createProduct = async (data) => {
  try {
    const res = await api.post("product/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllProduct = async () => {
  try {
    const res = await api.get("product/");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (sku, data) => {
  try {
    const res = await api.patch(`product/${sku}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (sku) => {
  try {
    const res = await api.delete(`product/${sku}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
