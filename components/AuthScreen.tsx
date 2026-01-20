import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ForgotPasswordForm from "./ForgotPasswordForm";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type Props = {
    onLoginSuccess?: () => void;
};

export default function AuthScreen({ onLoginSuccess }: Props) {
    const [screen, setScreen] = useState<"login" | "register" | "forgot">("login");

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Sopi</Text>

            <View style={styles.card}>
                {screen === "login" && (
                    <LoginForm
                        onForgotPassword={() => setScreen("forgot")}
                        onRegister={() => setScreen("register")}
                        onLoginSuccess={onLoginSuccess}
                    />
                )}

                {screen === "register" && (
                    <RegisterForm onBackToLogin={() => setScreen("login")} />
                )}

                {screen === "forgot" && (
                    <ForgotPasswordForm onBackToLogin={() => setScreen("login")} />
                )}
            </View>

            {screen !== "forgot" && (
                <TouchableOpacity
                    onPress={() =>
                        setScreen(screen === "login" ? "register" : "login")
                    }
                >
                    <Text style={styles.switchText}>
                        {screen === "login"
                            ? "Chưa có tài khoản? Đăng ký"
                            : "Đã có tài khoản? Đăng nhập"}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        padding: 20,
    },
    logo: {
        fontSize: 36,
        fontWeight: "900",
        color: "#ee4d2d",
        textAlign: "center",
        marginBottom: 30,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        elevation: 4,
    },
    switchText: {
        marginTop: 20,
        textAlign: "center",
        color: "#ee4d2d",
        fontWeight: "600",
    },
});
