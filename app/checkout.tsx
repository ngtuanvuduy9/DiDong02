import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const CART_KEY = "CART_ITEMS";

export default function CheckoutScreen() {
    const router = useRouter();
    const { ids } = useLocalSearchParams();

    const selectedIds: number[] = ids ? JSON.parse(ids as string) : [];

    const [items, setItems] = useState<any[]>([]);
    const [shipping, setShipping] = useState<"normal" | "fast">("normal");

    // 🔄 Load sản phẩm được chọn
    useEffect(() => {
        const loadData = async () => {
            const json = await AsyncStorage.getItem(CART_KEY);
            const cart = json ? JSON.parse(json) : [];

            const selectedItems = cart.filter((i: any) =>
                selectedIds.includes(i.id)
            );

            setItems(selectedItems);
        };

        loadData();
    }, []);

    // 💰 TÍNH TIỀN
    const productTotal = items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
    );

    const shippingFee = shipping === "fast" ? 30000 : 0;
    const grandTotal = productTotal + shippingFee;

    // 🧾 ĐẶT HÀNG
    const placeOrder = async () => {
        Alert.alert(
            "Xác nhận đặt hàng",
            "Bạn có chắc muốn đặt hàng không?",
            [
                { text: "Huỷ", style: "cancel" },
                {
                    text: "Đặt hàng",
                    onPress: async () => {
                        const json = await AsyncStorage.getItem(CART_KEY);
                        const cart = json ? JSON.parse(json) : [];

                        // ❌ Xoá SP đã mua khỏi giỏ
                        const newCart = cart.filter(
                            (i: any) => !selectedIds.includes(i.id)
                        );

                        await AsyncStorage.setItem(
                            CART_KEY,
                            JSON.stringify(newCart)
                        );

                        Alert.alert("🎉 Thành công", "Đặt hàng thành công!");
                        router.replace("/cart");
                    },
                },
            ]
        );
    };

    return (

        <ScrollView style={styles.container}>
            {/* 🔙 HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Thanh toán</Text>

                <View style={{ width: 24 }} />
            </View>

            {/* 👤 THÔNG TIN KHÁCH */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Thông tin người nhận</Text>
                <Text>Nguyễn Tuấn Vũ Duy</Text>
                <Text>📧 duy@email.com</Text>
                <Text>📞 0123 456 789</Text>
                <Text>🏠 TP.HCM</Text>
            </View>

            {/* 📦 ĐƠN HÀNG */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Đơn hàng</Text>

                {items.map(item => (
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

            {/* 🚚 VẬN CHUYỂN */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>

                <TouchableOpacity
                    style={styles.radioRow}
                    onPress={() => setShipping("normal")}
                >
                    <Text>{shipping === "normal" ? "🔘" : "⚪"} Nhanh (Miễn phí)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.radioRow}
                    onPress={() => setShipping("fast")}
                >
                    <Text>{shipping === "fast" ? "🔘" : "⚪"} Hoả tốc (+30.000 ₫)</Text>
                </TouchableOpacity>
            </View>

            {/* 💳 THANH TOÁN */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Thanh toán</Text>
                <Text>💵 Thanh toán khi nhận hàng (COD)</Text>
            </View>

            {/* 💰 TỔNG TIỀN */}
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

            {/* 🛒 ĐẶT HÀNG */}
            <TouchableOpacity style={styles.orderBtn} onPress={placeOrder}>
                <Text style={styles.orderText}>Đặt hàng</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
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

});
