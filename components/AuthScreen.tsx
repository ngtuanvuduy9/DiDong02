import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import ForgotPasswordScreen from "./ForgotPasswordScreen";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type ScreenType = "login" | "register" | "forgot";

export default function AuthScreen() {
    const [currentScreen, setCurrentScreen] = useState<ScreenType>("login");

    if (currentScreen === "forgot") {
        return (
            <ForgotPasswordScreen
                onBackToLogin={() => setCurrentScreen("login")}
            />
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>
                    {/* HEADER */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Chào mừng!</Text>
                        <Text style={styles.headerSubtitle}>
                            {currentScreen === "login"
                                ? "Đăng nhập để tiếp tục"
                                : "Tạo tài khoản mới"}
                        </Text>
                    </View>

                    {/* FORM */}
                    <View style={styles.formBody}>
                        {currentScreen === "login" ? (
                            <LoginForm
                                onForgotPassword={() => setCurrentScreen("forgot")}
                                onRegister={() => setCurrentScreen("register")}
                            />
                        ) : (
                            <RegisterForm
                                onBackToLogin={() => setCurrentScreen("login")}
                            />
                        )}

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>Hoặc tiếp tục với</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social */}
                        <View style={styles.socialContainer}>
                            <TouchableOpacity style={styles.socialButton}>
                                <FontAwesome name="google" size={20} color="#EA4335" />
                                <Text style={styles.socialText}>Google</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.socialButton}>
                                <FontAwesome name="facebook" size={20} color="#1877F2" />
                                <Text style={styles.socialText}>Facebook</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#000",
    },
    card: {
        backgroundColor: "#1a1a1a",
        borderRadius: 24,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#2a2a2a",
    },
    header: {
        backgroundColor: "#000",
        paddingVertical: 40,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "900",
        color: "#fff",
    },
    headerSubtitle: {
        color: "#999",
        fontSize: 16,
    },
    formBody: {
        padding: 24,
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#333",
    },
    dividerText: {
        marginHorizontal: 12,
        color: "#666",
        fontSize: 11,
    },
    socialContainer: {
        flexDirection: "row",
        gap: 15,
    },
    socialButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 12,
    },
    socialText: {
        marginLeft: 8,
        color: "#fff",
        fontWeight: "600",
    },
});
