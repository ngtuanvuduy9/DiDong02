import {
    getCustomerById,
    getOrderById,
    getOrderItems,
    getProductById,
} from "@/services/api.service";
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

/* =======================
   TYPES
======================= */
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

type Customer = {
    id: number;
    fullName: string;
    email?: string;
    phone: string;
    address: string;
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
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [items, setItems] = useState<OrderItemWithProduct[]>([]);

    /* =======================
       LOAD DATA
    ======================= */
    useEffect(() => {
        const loadData = async () => {
            try {
                if (!orderId) return;

                // 1️⃣ ORDER
                const orderData = await getOrderById(Number(orderId));
                setOrder(orderData);

                // 2️⃣ CUSTOMER
                if (orderData.customerId) {
                    const customerData = await getCustomerById(orderData.customerId);
                    setCustomer(customerData);
                }

                // 3️⃣ ORDER ITEMS
                const itemsData = await getOrderItems(Number(orderId));
                const filtered = itemsData.filter(
                    (i: OrderItem) => i.orderId === Number(orderId)
                );

                const withProducts = await Promise.all(
                    filtered.map(async (item: OrderItem) => {
                        try {
                            const product = await getProductById(item.productId);
                            return { ...item, product };
                        } catch {
                            return item;
                        }
                    })
                );

                setItems(withProducts);
            } catch (err) {
                console.error("❌ Load order failed:", err);
            }
        };

        loadData();
    }, [orderId]);

    return (
        <ScrollView style={styles.container}>
            {/* SUCCESS */}
            <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
                <Text style={styles.successTitle}>Đặt hàng thành công! 🎉</Text>
                <Text style={styles.successSubtitle}>Cảm ơn bạn đã mua hàng</Text>
            </View>

            {/* ORDER INFO */}
            {order && (
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Mã đơn:</Text>
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
                                { color: order.status === "PENDING" ? "#ff9800" : "#4CAF50" },
                            ]}
                        >
                            {order.status === "PENDING" ? "Chờ xử lý" : order.status}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Vận chuyển:</Text>
                        <Text style={styles.value}>
                            {order.shippingMethod === "FAST" ? "Hoả tốc" : "Thường"}
                        </Text>
                    </View>
                </View>
            )}

            {/* CUSTOMER INFO */}
            {customer && (
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Họ tên:</Text>
                        <Text style={styles.value}>{customer.fullName}</Text>
                    </View>

                    {customer.email && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Email:</Text>
                            <Text style={styles.value}>{customer.email}</Text>
                        </View>
                    )}

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>SĐT:</Text>
                        <Text style={styles.value}>{customer.phone}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Địa chỉ:</Text>
                        <Text style={[styles.value, { textAlign: "right", flex: 1 }]}>
                            {customer.address}
                        </Text>
                    </View>
                </View>
            )}

            {/* PRODUCTS */}
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
                                    <Text>x{item.quantity}</Text>
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
            {order && (
                <View style={styles.card}>
                    <View style={styles.totalRow}>
                        <Text>Tạm tính:</Text>
                        <Text>
                            {(order.totalAmount - order.shippingFee).toLocaleString()} ₫
                        </Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text>Phí ship:</Text>
                        <Text>{order.shippingFee.toLocaleString()} ₫</Text>
                    </View>

                    <View style={[styles.totalRow, styles.grandTotal]}>
                        <Text style={styles.grandTotalText}>Tổng cộng:</Text>
                        <Text style={styles.grandTotalText}>
                            {order.totalAmount.toLocaleString()} ₫
                        </Text>
                    </View>
                </View>
            )}

            {/* BUTTON */}
            <TouchableOpacity
                style={styles.homeBtn}
                onPress={() => router.replace("/")}
            >
                <Text style={styles.homeBtnText}>Về trang chủ</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5", padding: 15 },
    successBox: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
        marginBottom: 15,
        borderTopWidth: 4,
        borderTopColor: "#4CAF50",
    },
    successTitle: { fontSize: 22, fontWeight: "700", marginTop: 10 },
    successSubtitle: { fontSize: 14, color: "#666", marginTop: 5 },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginBottom: 12,
    },
    sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    label: { color: "#666" },
    value: { fontWeight: "600" },
    itemRow: {
        flexDirection: "row",
        gap: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    itemImage: { width: 70, height: 70, borderRadius: 8 },
    itemInfo: { flex: 1 },
    itemTitle: { fontWeight: "600" },
    itemDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6,
    },
    itemPrice: { color: "#ee4d2d", fontWeight: "700" },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
    },
    grandTotal: { borderTopWidth: 2, marginTop: 8 },
    grandTotalText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#ee4d2d",
    },
    homeBtn: {
        backgroundColor: "#ee4d2d",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 30,
    },
    homeBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
