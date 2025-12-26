import axios from "axios";

const API_URL = "https://fakestoreapi.com";

export const getProducts = async () => {
    const res = await axios.get(`${API_URL}/products`);
    return res.data;
};

export const getProductById = async (id: number) => {
    const res = await axios.get(`${API_URL}/products/${id}`);
    return res.data;
};

export const getCategories = async () => {
    const res = await axios.get(`${API_URL}/products/categories`);
    return res.data;
};

export const getProductsByCategory = async (category: string) => {
    const res = await axios.get(`${API_URL}/products/category/${category}`);
    return res.data;
};
