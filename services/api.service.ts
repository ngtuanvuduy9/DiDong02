import api from "./api";

/* =======================
   PRODUCTS
======================= */

export const getProducts = async () => {
    const res = await api.get("/products");
    return res.data.data;
};

export const getProductById = async (id: number) => {
    const res = await api.get(`/products/${id}`);
    return res.data.data;
};

export const getProductsByCategory = async (categoryId: number) => {
    const res = await api.get(`/products/category/${categoryId}`);
    return res.data.data;
};

/* =======================
   CATEGORIES
======================= */

export const getCategories = async () => {
    const res = await api.get("/categories");
    return res.data.data;
};

export const getActiveCategories = async () => {
    const res = await api.get("/categories/active");
    return res.data.data;
};

/* =======================
   AUTHORS
======================= */

export const getAuthors = async () => {
    const res = await api.get("/authors");
    return res.data.data;
};

/* =======================
   PUBLISHERS
======================= */

export const getPublishers = async () => {
    const res = await api.get("/publishers");
    return res.data.data;
};
