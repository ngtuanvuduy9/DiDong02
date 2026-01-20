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
/* =======================
   CUSTOMERS
======================= */
export const createCustomer = async (data: {
    fullName: string;
    email?: string;
    phone: string;
    address: string;
    isActive: boolean;
}) => {
    const res = await api.post("/customers", data);
    return res.data.data;
};
export const getCustomerById = async (id: number) => {
    const res = await api.get(`/customers/${id}`);
    return res.data.data;
};

/* =======================
   ORDERS
======================= */
export const createOrder = async (data: {
    customerId: number;
    totalAmount: number;
    status: string;
    shippingMethod: string;
    shippingFee: number;
    notes?: string;
}) => {
    const res = await api.post("/orders", data);
    return res.data.data;
};

/* =======================
   ORDER ITEMS
======================= */
export const createOrderItem = async (data: {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    subtotal: number;
}) => {
    const res = await api.post("/orderItems", data);
    return res.data.data;
};

/* =======================
   GET ORDERS
======================= */
export const getOrderById = async (id: number) => {
    const res = await api.get(`/orders/${id}`);
    return res.data.data;
};

export const getOrderItems = async (orderId: number) => {
    const res = await api.get(`/orderItems?orderId=${orderId}`);
    return res.data.data;
};

export const getOrdersByCustomer = async (customerId: number) => {
    const res = await api.get(`/orders?customerId=${customerId}`);
    return res.data.data;
};