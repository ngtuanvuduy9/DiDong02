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
/* ===================== CATEGORIES ===================== */


// 👉 Lấy category + sản phẩm bên trong (hay dùng cho Shopee Home)
export const getCategoryWithProducts = async (category: string) => {
    const products = await getProductsByCategory(category);

    return {
        name: category,
        products,
    };
};

// 👉 Lấy tất cả category + products (Home Page)
export const getAllCategoriesWithProducts = async () => {
    const categories: string[] = await getCategories();

    const result = await Promise.all(
        categories.map(async (cat: string) => ({
            name: cat,
            products: await getProductsByCategory(cat),
        }))
    );

    return result;
};
/* ===================== CARTS (🔥 PHẦN BẠN CẦN) ===================== */

// 👉 Lấy cart theo user (userId demo: 1)
export const getCartByUser = async (userId: number) => {
    const res = await axios.get(`${API_URL}/carts/user/${userId}`);
    return res.data;
};
// Lấy cart + chi tiết sản phẩm
export const getCartWithProducts = async (userId: number) => {
    const carts = await getCartByUser(userId);

    if (carts.length === 0) return [];

    const cart = carts[0]; // fakestore thường chỉ có 1 cart

    const products = await Promise.all(
        cart.products.map(async (item: any) => {
            const product = await getProductById(item.productId);
            return {
                ...product,
                quantity: item.quantity,
            };
        })
    );

    return products;
};
// 👉 Tạo cart mới
export const createCart = async (
    userId: number,
    products: { productId: number; quantity: number }[]
) => {
    const res = await axios.post(`${API_URL}/carts`, {
        userId,
        date: new Date(),
        products,
    });

    return res.data;
};

// 👉 Cập nhật cart
export const updateCart = async (
    cartId: number,
    products: { productId: number; quantity: number }[]
) => {
    const res = await axios.put(`${API_URL}/carts/${cartId}`, {
        date: new Date(),
        products,
    });

    return res.data;
};

// 👉 Xoá cart (demo)
export const deleteCart = async (cartId: number) => {
    const res = await axios.delete(`${API_URL}/carts/${cartId}`);
    return res.data;
};