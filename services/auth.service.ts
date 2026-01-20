import api from "./api";


/* =======================
   FORGOT PASSWORD (OTP)
======================= */

// GỬI OTP
export const forgotPassword = async (email: string) => {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
};

// RESET PASSWORD
export const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string
) => {
    const res = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
    });

    return res.data;
};
