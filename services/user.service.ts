import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

const USER_KEY = "currentUser";
const TOKEN_KEY = "token";

/* =======================
   AUTH
======================= */

// LOGIN
export const login = async (email: string, password: string) => {
    const res = await api.post("/users/login", {
        email,
        password,
    });

    if (res.data?.data) {
        const { user, token } = res.data.data;

        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        await AsyncStorage.setItem(TOKEN_KEY, token);
    }

    return res.data;
};

// REGISTER
export const register = async (
    fullName: string,
    email: string,
    password: string
) => {
    const res = await api.post("/users", {
        username: email,
        password,
        email,
        fullName,
        role: "USER",
    });

    return res.data;
};

// GET CURRENT USER
export const getCurrentUser = async () => {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

// LOGOUT
export const logout = async () => {
    await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY]);
};

// GET TOKEN
export const getToken = async () => {
    return await AsyncStorage.getItem(TOKEN_KEY);
};

/* =======================
   USER CRUD
======================= */

export const getAllUsers = async () => {
    const res = await api.get("/users");
    return res.data;
};

export const getUserById = async (id: number) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
};

export const getUserByUsername = async (username: string) => {
    const res = await api.get(`/users/username/${username}`);
    return res.data;
};

export const getUserByEmail = async (email: string) => {
    const res = await api.get(`/users/email/${email}`);
    return res.data;
};

export const updateUser = async (id: number, data: any) => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
};

export const deleteUser = async (id: number) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
};
