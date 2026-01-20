import { forgotPassword, resetPassword } from "@/services/auth.service";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
    onBackToLogin: () => void;
};

export default function ForgotPasswordForm({ onBackToLogin }: Props) {
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // STEP 1: SEND OTP
    const handleSendOtp = async () => {
        if (!email) {
            Alert.alert("Lỗi", "Vui lòng nhập email");
            return;
        }

        try {
            setLoading(true);
            await forgotPassword(email);
            Alert.alert("Thành công", "Đã gửi OTP qua email");
            setStep(2);
        } catch (err: any) {
            Alert.alert("Lỗi", err?.response?.data?.message || "Không gửi được OTP");
        } finally {
            setLoading(false);
        }
    };

    // STEP 2: RESET PASSWORD
    const handleResetPassword = async () => {
        if (!otp || !newPassword) {
            Alert.alert("Lỗi", "Vui lòng nhập đủ OTP và mật khẩu mới");
            return;
        }

        try {
            setLoading(true);
            const res = await resetPassword(email, otp, newPassword);

            if (res.success) {
                Alert.alert(
                    "🎉 Thành công",
                    res.message || "Đổi mật khẩu thành công"
                );

                setTimeout(() => {
                    onBackToLogin();
                }, 300);

            } else {
                Alert.alert("Lỗi", res.message || "Đổi mật khẩu thất bại");
            }

        } catch (err: any) {
            Alert.alert("Lỗi", err?.response?.data?.message || "OTP không hợp lệ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <Text style={styles.title}>Quên mật khẩu</Text>

            {/* STEP 1 */}
            {step === 1 && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSendOtp}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? "Đang gửi..." : "Gửi OTP"}
                        </Text>
                    </TouchableOpacity>
                </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="OTP"
                        keyboardType="number-pad"
                        value={otp}
                        onChangeText={setOtp}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Mật khẩu mới"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleResetPassword}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                        </Text>
                    </TouchableOpacity>
                </>
            )}

            <TouchableOpacity onPress={onBackToLogin}>
                <Text style={styles.backText}>← Quay lại đăng nhập</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 16,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#fafafa",
    },
    button: {
        backgroundColor: "#ee4d2d",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 6,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },
    backText: {
        marginTop: 16,
        textAlign: "center",
        color: "#ee4d2d",
        fontWeight: "600",
    },
});
