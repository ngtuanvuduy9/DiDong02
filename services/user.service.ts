import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

const USER_KEY = "currentUser";
const TOKEN_KEY = "token";

/* =======================
   AUTH
======================= */

// LOGIN
export const login = async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/login`, {
        email,
        password,
    });

    // res.data = ApiResponse<LoginResponse>
    if (res.data?.data) {
        const { user, token } = res.data.data;

        // lưu giống auth test
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
    const res = await axios.post(API_URL, {
        username: email,
        password,
        email,
        fullName,
        role: "USER",
    });

    return res.data;
};

// GET CURRENT USER (🔥 CÁI BẠN ĐANG THIẾU)
export const getCurrentUser = async () => {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

// LOGOUT
export const logout = async () => {
    await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY]);
};

// GET TOKEN (dùng cho interceptor sau này)
export const getToken = async () => {
    return await AsyncStorage.getItem(TOKEN_KEY);
};

/* =======================
   USER CRUD
======================= */

export const getAllUsers = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

export const getUserById = async (id: number) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
};

export const getUserByUsername = async (username: string) => {
    const res = await axios.get(`${API_URL}/username/${username}`);
    return res.data;
};

export const getUserByEmail = async (email: string) => {
    const res = await axios.get(`${API_URL}/email/${email}`);
    return res.data;
};

export const updateUser = async (id: number, data: any) => {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
};

export const deleteUser = async (id: number) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};
