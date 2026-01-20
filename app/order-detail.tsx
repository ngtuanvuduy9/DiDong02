import { getOrderById, getOrderItems, getProductById } from "@/services/api.service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Order = {
    id: number;
    customerId: number;
    orderDate: string;
    status: string;
    totalAmount: number;
    shippingMethod: string;
    shippingFee: number;
    notes: string;
};

type OrderItem = {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    subtotal: number;
};

type OrderItemWithProduct = OrderItem & {
    product?: {
        id: number;
        title: string;
        mainImage?: string;
    };
};

export default function OrderDetail() {
    const { orderId } = useLocalSearchParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [items, setItems] = useState<OrderItemWithProduct[]>([]);

    useEffect(() => {
        const loadOrderData = async () => {
            try {
                if (!orderId) return;
                const orderData = await getOrderById(Number(orderId));
                const itemsData = await getOrderItems(Number(orderId));
                setOrder(orderData);

                // Filter items to only show items for this order
                const filteredItems = itemsData.filter((item: OrderItem) => item.orderId === Number(orderId));

                // Fetch product details for each item
                const itemsWithProducts = await Promise.all(
                    filteredItems.map(async (item: OrderItem) => {
                        try {
                            const product = await getProductById(item.productId);
                            return { ...item, product };
                        } catch {
                            return item;
                        }
                    })
                );

                setItems(itemsWithProducts);
            } catch (error) {
                console.error("Error loading order:", error);
            }
        };

        loadOrderData();
    }, [orderId]);

    return (
        <ScrollView style={styles.container}>
            {/* SUCCESS MESSAGE */}
            <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
                <Text style={styles.successTitle}>Đặt hàng thành công! 🎉</Text>
                <Text style={styles.successSubtitle}>
                    Cảm ơn bạn đã mua hàng
                </Text>
            </View>

            {/* ORDER INFO */}
            {order && (
                <>
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Mã đơn hàng:</Text>
                            <Text style={styles.value}>#{order.id}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Ngày đặt:</Text>
                            <Text style={styles.value}>
                                {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Trạng thái:</Text>
                            <Text
                                style={[
                                    styles.value,
                                    {
                                        color:
                                            order.status === "PENDING"
                                                ? "#ff9800"
                                                : "#4CAF50",
                                    },
                                ]}
                            >
                                {order.status === "PENDING"
                                    ? "Chờ xử lý"
                                    : order.status}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Vận chuyển:</Text>
                            <Text style={styles.value}>
                                {order.shippingMethod === "FAST"
                                    ? "Hoả tốc"
                                    : "Thường"}
                            </Text>
                        </View>
                    </View>

                    {/* ORDER ITEMS */}
                    {items.length > 0 && (
                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>Sản phẩm</Text>

                            {items.map((item) => (
                                <View key={item.id} style={styles.itemRow}>
                                    {item.product?.mainImage && (
                                        <Image
                                            source={{ uri: item.product.mainImage }}
                                            style={styles.itemImage}
                                        />
                                    )}
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemTitle} numberOfLines={2}>
                                            {item.product?.title || "Sản phẩm"}
                                        </Text>
                                        <View style={styles.itemDetails}>
                                            <Text style={styles.itemQty}>x{item.quantity}</Text>
                                            <Text style={styles.itemPrice}>
                                                {(item.price * item.quantity).toLocaleString()} ₫
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* TOTAL */}
                    <View style={styles.card}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Tạm tính:</Text>
                            <Text>
                                {(
                                    order.totalAmount - order.shippingFee
                                ).toLocaleString()} ₫
                            </Text>
                        </View>

                        {order.shippingFee > 0 && (
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Phí vận chuyển:</Text>
                                <Text>{order.shippingFee.toLocaleString()} ₫</Text>
                            </View>
                        )}

                        <View style={[styles.totalRow, styles.grandTotal]}>
                            <Text style={styles.grandTotalText}>Tổng cộng:</Text>
                            <Text style={styles.grandTotalText}>
                                {order.totalAmount.toLocaleString()} ₫
                            </Text>
                        </View>
                    </View>
                </>
            )}

            {/* BUTTONS */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.homeBtn}
                    onPress={() => router.replace("/")}
                >
                    <Text style={styles.homeBtnText}>Về trang chủ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.orderBtn}
                    onPress={() => router.push("/order-detail")}
                >
                    <Text style={styles.orderBtnText}>Xem đơn hàng</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 15,
    },
    successBox: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
        marginBottom: 15,
        borderTopWidth: 4,
        borderTopColor: "#4CAF50",
    },
    successTitle: {
        fontSize: 22,
        fontWeight: "700",
        marginTop: 10,
        color: "#333",
    },
    successSubtitle: {
        fontSize: 14,
        color: "#666",
        marginTop: 5,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 12,
        color: "#333",
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    label: {
        fontSize: 14,
        color: "#666",
    },
    value: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        gap: 12,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
    },
    itemInfo: {
        flex: 1,
        justifyContent: "space-between",
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    itemDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    itemQty: {
        fontSize: 13,
        color: "#999",
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: "600",
        color: "#ee4d2d",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
    },
    totalLabel: {
        fontSize: 14,
        color: "#666",
    },
    grandTotal: {
        borderTopWidth: 2,
        borderTopColor: "#f0f0f0",
        marginTop: 10,
        paddingTop: 12,
    },
    grandTotalText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#ee4d2d",
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 30,
    },
    homeBtn: {
        flex: 1,
        backgroundColor: "#ee4d2d",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    homeBtnText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
    orderBtn: {
        flex: 1,
        backgroundColor: "#fff",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#ee4d2d",
    },
    orderBtnText: {
        color: "#ee4d2d",
        fontSize: 15,
        fontWeight: "700",
    },
});
