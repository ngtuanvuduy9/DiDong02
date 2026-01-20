import { getCurrentUser } from "@/services/user.service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getOrdersByCustomer } from "@/services/api.service";

export default function OrdersScreen() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                // Get current user
                const currentUser = await getCurrentUser();

                if (currentUser && currentUser.id) {
                    // Fetch orders for this customer
                    const response = await getOrdersByCustomer(currentUser.id);
                    setOrders(response);
                }
            } catch (error) {
                console.error("❌ Lỗi tải đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#ee4d2d" />
            </View>
        );
    }

    if (orders.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>📦 Chưa có đơn hàng nào</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.orderCard}
                        onPress={() =>
                            router.push({
                                pathname: "/order-detail",
                                params: { orderId: item.id },
                            })
                        }
                    >
                        <View style={styles.orderHeader}>
                            <Text style={styles.orderId}>Đơn #{item.id}</Text>
                            <Text
                                style={[
                                    styles.status,
                                    {
                                        color:
                                            item.status === "PENDING"
                                                ? "#ff9800"
                                                : item.status === "COMPLETED"
                                                    ? "#4caf50"
                                                    : "#f44336",
                                    },
                                ]}
                            >
                                {item.status}
                            </Text>
                        </View>

                        <View style={styles.orderDetails}>
                            <Text style={styles.label}>Ngày đặt:</Text>
                            <Text style={styles.value}>
                                {new Date(item.orderDate).toLocaleDateString("vi-VN")}
                            </Text>
                        </View>

                        <View style={styles.orderDetails}>
                            <Text style={styles.label}>Tổng tiền:</Text>
                            <Text style={styles.totalAmount}>
                                {item.totalAmount.toLocaleString()} ₫
                            </Text>
                        </View>

                        <View style={styles.orderDetails}>
                            <Text style={styles.label}>Vận chuyển:</Text>
                            <Text style={styles.value}>{item.shippingMethod}</Text>
                        </View>

                        <Text style={styles.viewDetail}>Xem chi tiết →</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
                scrollEnabled={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
    },
    listContent: {
        padding: 10,
    },
    orderCard: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginBottom: 12,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    orderId: {
        fontSize: 16,
        fontWeight: "700",
        color: "#333",
    },
    status: {
        fontSize: 12,
        fontWeight: "600",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: "#f0f0f0",
    },
    orderDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 6,
    },
    label: {
        fontSize: 13,
        color: "#666",
        fontWeight: "500",
    },
    value: {
        fontSize: 13,
        color: "#333",
        fontWeight: "500",
    },
    totalAmount: {
        fontSize: 14,
        color: "#ee4d2d",
        fontWeight: "700",
    },
    viewDetail: {
        fontSize: 12,
        color: "#ee4d2d",
        fontWeight: "600",
        marginTop: 10,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
    },
});
