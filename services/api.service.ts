import axios from "axios";

const API_URL = "http://localhost:8080/api";
export const getProducts = async () => {
    const res = await axios.get(`${API_URL}/products`);
    return res.data.data; // ✅ RẤT QUAN TRỌNG
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
