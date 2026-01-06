import axios from "axios";
import { getApiUrl } from "../config/network";

const api = axios.create({
    baseURL: getApiUrl(), // 👈 CHÍNH DÒNG NÀY
    timeout: 10000,
});

export default api;
