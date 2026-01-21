import {
    createCustomer,
    createOrder,
    createOrderItem,
} from "@/services/api.service";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const CART_KEY = "CART_ITEMS";

/* =======================
   TYPES
======================= */
type CartItem = {
    id: number;
    title: string;
    price: number;
    quantity: number;
};

type CustomerPayload = {
    fullName: string;
    email?: string;
    phone: string;
    address: string;
    isActive?: boolean;
};

export default function CheckoutScreen() {
    const router = useRouter();
    const { ids } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);

    const selectedIds: number[] = ids ? JSON.parse(ids as string) : [];

    const [items, setItems] = useState<CartItem[]>([]);
    const [shipping, setShipping] = useState<"normal" | "fast">("normal");

    /* =======================
       CUSTOMER FORM
    ======================= */
    const [customer, setCustomer] = useState<CustomerPayload>({
        fullName: "",
        email: "",
        phone: "",
        address: "",
    });

    /* =======================
       VALIDATE
    ======================= */
    const isValidPhone = (phone: string) => {
        return /^[0-9]{10}$/.test(phone);
    };

    const isValidEmail = (email: string) => {
        if (!email) return true; // email không bắt buộc
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    /* =======================
       LOAD CART
    ======================= */
    useEffect(() => {
        const loadData = async () => {
            const json = await AsyncStorage.getItem(CART_KEY);
            const cart: CartItem[] = json ? JSON.parse(json) : [];

            const selectedItems = cart.filter(
                (i: CartItem) => selectedIds.includes(i.id)
            );

            setItems(selectedItems);
        };

        loadData();
    }, []);

    /* =======================
       CALCULATE PRICE
    ======================= */
    const productTotal = items.reduce(
        (sum: number, i: CartItem) => sum + i.price * i.quantity,
        0
    );

    const shippingFee = shipping === "fast" ? 30000 : 0;
    const grandTotal = productTotal + shippingFee;

    /* =======================
       PLACE ORDER
    ======================= */
    const placeOrder = async () => {
        if (loading) return;

        if (!customer.fullName || !customer.phone || !customer.address) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (!isValidPhone(customer.phone)) {
            Alert.alert("Lỗi", "Số điện thoại phải gồm đúng 10 chữ số");
            return;
        }

        if (!isValidEmail(customer.email || "")) {
            Alert.alert("Lỗi", "Email không đúng định dạng");
            return;
        }

        if (items.length === 0) {
            Alert.alert("Lỗi", "Không có sản phẩm để đặt hàng");
            return;
        }

        try {
            setLoading(true);

            // 1️⃣ CREATE CUSTOMER
            const savedCustomer = await createCustomer({
                ...customer,
                isActive: true,
            });

            // 2️⃣ CREATE ORDER
            const order = await createOrder({
                customerId: savedCustomer.id,
                totalAmount: grandTotal,
                status: "PENDING",
                shippingMethod: shipping === "fast" ? "FAST" : "NORMAL",
                shippingFee: shippingFee,
                notes: "Đặt hàng từ mobile app",
            });

            // 3️⃣ CREATE ORDER ITEMS
            for (const item of items) {
                await createOrderItem({
                    orderId: order.id,
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    subtotal: item.price * item.quantity,
                });
            }

            // 4️⃣ REMOVE BOUGHT ITEMS FROM CART
            const json = await AsyncStorage.getItem(CART_KEY);
            const cart: CartItem[] = json ? JSON.parse(json) : [];

            const newCart = cart.filter(
                (i: CartItem) => !selectedIds.includes(i.id)
            );

            await AsyncStorage.setItem(CART_KEY, JSON.stringify(newCart));

            // 5️⃣ NAVIGATE
            setLoading(false);
            setTimeout(() => {
                router.replace("/(tabs)");
            }, 1500);
        } catch (error: any) {
            Alert.alert(
                "Lỗi",
                error?.response?.data?.message || "Không thể đặt hàng"
            );
            setLoading(false);
        }
    };

    /* =======================
       UI
    ======================= */
    return (
        <ScrollView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thanh toán</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* CUSTOMER */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Thông tin người nhận</Text>

                <TextInput
                    placeholder="Họ và tên"
                    style={styles.input}
                    value={customer.fullName}
                    onChangeText={(text) =>
                        setCustomer({ ...customer, fullName: text })
                    }
                />

                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={customer.email}
                    onChangeText={(text) =>
                        setCustomer({ ...customer, email: text })
                    }
                />

                <TextInput
                    placeholder="Số điện thoại"
                    style={styles.input}
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={customer.phone}
                    onChangeText={(text) =>
                        setCustomer({
                            ...customer,
                            phone: text.replace(/[^0-9]/g, ""),
                        })
                    }
                />

                <TextInput
                    placeholder="Địa chỉ"
                    style={styles.input}
                    value={customer.address}
                    onChangeText={(text) =>
                        setCustomer({ ...customer, address: text })
                    }
                />
            </View>

            {/* ORDER ITEMS */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Đơn hàng</Text>

                {items.map((item: CartItem) => (
                    <View key={item.id} style={styles.row}>
                        <Text style={{ flex: 1 }} numberOfLines={1}>
                            {item.title} x{item.quantity}
                        </Text>
                        <Text>
                            {(item.price * item.quantity).toLocaleString()} ₫
                        </Text>
                    </View>
                ))}
            </View>

            {/* SHIPPING */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Vận chuyển</Text>

                <TouchableOpacity
                    style={styles.radioRow}
                    onPress={() => setShipping("normal")}
                >
                    <Text>{shipping === "normal" ? "🔘" : "⚪"} Thường (Miễn phí)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.radioRow}
                    onPress={() => setShipping("fast")}
                >
                    <Text>{shipping === "fast" ? "🔘" : "⚪"} Hoả tốc (+30.000 ₫)</Text>
                </TouchableOpacity>
            </View>

            {/* TOTAL */}
            <View style={styles.card}>
                <View style={styles.row}>
                    <Text>Tiền hàng</Text>
                    <Text>{productTotal.toLocaleString()} ₫</Text>
                </View>

                <View style={styles.row}>
                    <Text>Phí vận chuyển</Text>
                    <Text>{shippingFee.toLocaleString()} ₫</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.total}>Tổng cộng</Text>
                    <Text style={styles.total}>
                        {grandTotal.toLocaleString()} ₫
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.orderBtn, loading && { opacity: 0.6 }]}
                onPress={placeOrder}
                disabled={loading}
            >
                <Text style={styles.orderText}>
                    {loading ? "Đang xử lý..." : "Đặt hàng"}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 10,
    },
    card: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    sectionTitle: {
        fontWeight: "700",
        marginBottom: 8,
        fontSize: 16,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 4,
    },
    radioRow: {
        paddingVertical: 6,
    },
    total: {
        fontWeight: "700",
        fontSize: 16,
        color: "#ee4d2d",
    },
    orderBtn: {
        backgroundColor: "#ee4d2d",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 30,
    },
    orderText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        backgroundColor: "#fafafa",
    },
});
