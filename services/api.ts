import axios from "axios";
import { getApiUrl } from "../config/network";

const api = axios.create({
    baseURL: getApiUrl(), // 👈 CHÍNH DÒNG NÀY
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }
});

// Debug: log all requests and responses
api.interceptors.request.use(
    (config) => {
        console.log(`🔵 REQUEST: ${config.method?.toUpperCase()} ${config.url}`);
        console.log("📦 Data:", config.data);
        return config;
    },
    (error) => {
        console.error("❌ REQUEST ERROR:", error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log(`✅ RESPONSE: ${response.status} ${response.config.url}`, response.data);
        return response;
    },
    (error) => {
        console.error(`❌ RESPONSE ERROR: ${error.response?.status}`, error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
