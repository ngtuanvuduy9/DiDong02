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
export const getProductsByCategory = async (categoryId: number) => {
    const res = await axios.get(
        `${API_URL}/products/category/${categoryId}`
    );
    return res.data.data;
};

export const getCategories = async () => {
    const res = await axios.get(`${API_URL}/categories`);
    return res.data.data; // lấy đúng data
};

export const getActiveCategories = async () => {
    const res = await axios.get(`${API_URL}/categories/active`);
    return res.data.data;
};
