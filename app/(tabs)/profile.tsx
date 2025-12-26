import AuthScreen from "@/components/AuthScreen";
import { getCurrentUser, logout } from "@/services/user.service";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, Button, Modal, StyleSheet, Text, View } from "react-native";

export default function Profile() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Lấy thông tin user khi vào trang profile
    useFocusEffect(
        useCallback(() => {
            const loadUser = async () => {
                setIsLoading(true);
                try {
                    const currentUser = await getCurrentUser();
                    setUser(currentUser);
                } catch (error) {
                    console.error("Lỗi tải user:", error);
                    setUser(null);
                } finally {
                    setIsLoading(false);
                }
            };
            loadUser();
        }, [])
    );

    const handleLoginPress = () => {
        setShowLoginModal(true);
    };

    const handleLoginSuccess = async () => {
        setShowLoginModal(false);
        // Reload user info
        const currentUser = await getCurrentUser();
        setUser(currentUser);
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#ee4d2d" />
            </View>
        );
    }

    // Chưa đăng nhập
    if (!user) {
        return (
            <>
                <View style={styles.container}>
                    <Text style={styles.title}>Tài khoản của tôi</Text>

                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>Vui lòng đăng nhập để xem tài khoản</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Đăng nhập"
                            onPress={handleLoginPress}
                            color="#ee4d2d"
                        />
                    </View>
                </View>

                <Modal
                    visible={showLoginModal}
                    animationType="slide"
                    onRequestClose={() => setShowLoginModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <AuthScreen onLoginSuccess={handleLoginSuccess} />
                    </View>
                </Modal>
            </>
        );
    }

    // Đã đăng nhập
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tài khoản của tôi</Text>

            <View style={styles.userInfo}>
                <Text style={styles.label}>Tên:</Text>
                <Text style={styles.value}>{user.name}</Text>

                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{user.email}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title={loading ? "Đang đăng xuất..." : "Đăng xuất"}
                    onPress={handleLogout}
                    disabled={loading}
                    color="#ee4d2d"
                />
                {loading && <ActivityIndicator size="small" color="#ee4d2d" style={{ marginTop: 10 }} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    userInfo: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 12,
        color: "#888",
        marginTop: 10,
        fontWeight: "600",
    },
    value: {
        fontSize: 16,
        color: "#333",
        marginTop: 5,
        fontWeight: "500",
    },
    buttonContainer: {
        marginTop: 20,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 30,
    },
    modalContainer: {
        flex: 1,
    },
});
