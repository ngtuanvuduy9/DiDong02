import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const CART_KEY = "CART_ITEMS";

export default function CartScreen() {
    const [items, setItems] = useState<any[]>([]);

    const loadCart = async () => {
        const json = await AsyncStorage.getItem(CART_KEY);
        setItems(json ? JSON.parse(json) : []);
    };

    useFocusEffect(
        useCallback(() => {
            loadCart();
        }, [])
    );

    // ➕➖ TĂNG / GIẢM
    const changeQty = async (id: number, delta: number) => {
        const json = await AsyncStorage.getItem(CART_KEY);
        let cart = json ? JSON.parse(json) : [];

        cart = cart
            .map((item: any) =>
                item.id === id
                    ? { ...item, quantity: item.quantity + delta }
                    : item
            )
            .filter((item: any) => item.quantity > 0); // <=0 thì xoá

        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
        setItems(cart);
    };

    // ❌ XOÁ SẢN PHẨM
    const removeItem = async (id: number) => {
        const json = await AsyncStorage.getItem(CART_KEY);
        const cart = json ? JSON.parse(json) : [];

        const newCart = cart.filter((item: any) => item.id !== id);

        await AsyncStorage.setItem(CART_KEY, JSON.stringify(newCart));
        setItems(newCart);
    };

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const clearCart = async () => {
        await AsyncStorage.removeItem(CART_KEY);
        setItems([]);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                    <Text style={{ textAlign: "center", marginTop: 40 }}>
                        Giỏ hàng trống
                    </Text>
                }
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Image
                            source={{
                                uri:
                                    item.mainImage ||
                                    "https://via.placeholder.com/100",
                            }}
                            style={styles.image}
                        />

                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={2}>{item.title}</Text>

                            {/* ➕➖ */}
                            <View style={styles.qtyRow}>
                                <TouchableOpacity
                                    style={styles.qtyBtn}
                                    onPress={() => changeQty(item.id, -1)}
                                >
                                    <Text style={styles.qtyText}>-</Text>
                                </TouchableOpacity>

                                <Text style={styles.qtyNumber}>
                                    {item.quantity}
                                </Text>

                                <TouchableOpacity
                                    style={styles.qtyBtn}
                                    onPress={() => changeQty(item.id, 1)}
                                >
                                    <Text style={styles.qtyText}>+</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.price}>
                                {(item.price * item.quantity).toLocaleString()} ₫
                            </Text>
                        </View>

                        {/* ❌ */}
                        <TouchableOpacity
                            onPress={() => removeItem(item.id)}
                        >
                            <Text style={styles.remove}>✕</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Giỏ hàng</Text>

                {items.length > 0 && (
                    <TouchableOpacity onPress={clearCart}>
                        <Text style={styles.clearAll}>Xoá tất cả</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.footer}>
                <Text style={styles.total}>
                    Tổng tiền: {total.toLocaleString()} ₫
                </Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 10,
    },
    item: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    image: {
        width: 60,
        height: 60,
        resizeMode: "contain",
        marginRight: 10,
    },
    price: {
        color: "#ee4d2d",
        fontWeight: "700",
        marginTop: 4,
    },
    footer: {
        padding: 12,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    total: {
        fontSize: 18,
        fontWeight: "700",
        color: "#ee4d2d",
        textAlign: "right",
    },
    qtyRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },
    qtyBtn: {
        width: 28,
        height: 28,
        borderRadius: 4,
        backgroundColor: "#eee",
        justifyContent: "center",
        alignItems: "center",
    },
    qtyText: {
        fontSize: 18,
        fontWeight: "700",
    },
    qtyNumber: {
        marginHorizontal: 10,
        fontSize: 14,
        fontWeight: "600",
    },
    remove: {
        fontSize: 18,
        color: "#999",
        paddingLeft: 6,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
    },
    clearAll: {
        color: "#ee4d2d",
        fontSize: 14,
        fontWeight: "600",
    },

});
