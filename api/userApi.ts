import axiosClient from "./axiosClient";

const userApi = {
    login(data: { email: string; password: string }) {
        return axiosClient.post("/api/users/login", data);
    },
};

export default userApi;
