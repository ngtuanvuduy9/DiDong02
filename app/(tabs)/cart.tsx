import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const CART_KEY = "CART_ITEMS";

export default function CartScreen() {
    const router = useRouter();
    const [items, setItems] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // 🔄 Load giỏ hàng
    const loadCart = async () => {
        const json = await AsyncStorage.getItem(CART_KEY);
        const cart = json ? JSON.parse(json) : [];
        setItems(cart);
        setSelectedIds([]); // reset chọn
    };

    useFocusEffect(
        useCallback(() => {
            loadCart();
        }, [])
    );

    // ➕➖ tăng giảm số lượng
    const changeQty = async (id: number, delta: number) => {
        let cart = [...items];

        cart = cart
            .map(item =>
                item.id === id
                    ? { ...item, quantity: item.quantity + delta }
                    : item
            )
            .filter(item => item.quantity > 0);

        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
        setItems(cart);

        // nếu SP bị xoá thì bỏ khỏi selected
        setSelectedIds(prev =>
            prev.filter(selectedId =>
                cart.some(i => i.id === selectedId)
            )
        );
    };

    // ❌ xoá 1 sản phẩm
    const removeItem = async (id: number) => {
        const cart = items.filter(i => i.id !== id);
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
        setItems(cart);
        setSelectedIds(prev => prev.filter(i => i !== id));
    };

    // 🧹 xoá tất cả
    const clearCart = async () => {
        await AsyncStorage.removeItem(CART_KEY);
        setItems([]);
        setSelectedIds([]);
    };

    // ☑️ chọn tất cả
    const toggleSelectAll = () => {
        if (selectedIds.length === items.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map(i => i.id));
        }
    };

    // 💰 tổng tiền (CHỈ tính SP đã chọn)
    const total = items
        .filter(i => selectedIds.includes(i.id))
        .reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={toggleSelectAll}>
                    <Text style={styles.checkbox}>
                        {selectedIds.length === items.length && items.length > 0
                            ? "☑️"
                            : "⬜"}{" "}
                        Chọn tất cả
                    </Text>
                </TouchableOpacity>

                {items.length > 0 && (
                    <TouchableOpacity onPress={clearCart}>
                        <Text style={styles.clearAll}>Xoá tất cả</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* DANH SÁCH */}
            <FlatList
                data={items}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={
                    <Text style={styles.empty}>Giỏ hàng trống</Text>
                }
                renderItem={({ item }) => {
                    const checked = selectedIds.includes(item.id);

                    return (
                        <View style={styles.item}>
                            {/* CHECKBOX */}
                            <TouchableOpacity
                                onPress={() =>
                                    setSelectedIds(prev =>
                                        checked
                                            ? prev.filter(i => i !== item.id)
                                            : [...prev, item.id]
                                    )
                                }
                            >
                                <Text style={styles.checkbox}>
                                    {checked ? "☑️" : "⬜"}
                                </Text>
                            </TouchableOpacity>

                            <Image
                                source={{
                                    uri:
                                        item.mainImage ||
                                        "https://via.placeholder.com/100",
                                }}
                                style={styles.image}
                            />

                            <View style={{ flex: 1 }}>
                                <Text numberOfLines={2}>
                                    {item.title}
                                </Text>

                                {/* ➕➖ */}
                                <View style={styles.qtyRow}>
                                    <TouchableOpacity
                                        style={styles.qtyBtn}
                                        onPress={() =>
                                            changeQty(item.id, -1)
                                        }
                                    >
                                        <Text>-</Text>
                                    </TouchableOpacity>

                                    <Text style={styles.qtyNumber}>
                                        {item.quantity}
                                    </Text>

                                    <TouchableOpacity
                                        style={styles.qtyBtn}
                                        onPress={() =>
                                            changeQty(item.id, 1)
                                        }
                                    >
                                        <Text>+</Text>
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
                    );
                }}
            />

            {/* FOOTER */}
            <View style={styles.footer}>
                <Text style={styles.total}>
                    Tổng: {total.toLocaleString()} ₫
                </Text>

                <TouchableOpacity
                    style={[
                        styles.buyBtn,
                        selectedIds.length === 0 && { opacity: 0.5 },
                    ]}
                    disabled={selectedIds.length === 0}
                    onPress={() =>
                        router.push({
                            pathname: "/checkout",
                            params: {
                                ids: JSON.stringify(selectedIds),
                            },
                        })
                    }
                >
                    <Text style={styles.buyText}>
                        Mua hàng ({selectedIds.length})
                    </Text>
                </TouchableOpacity>
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
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        padding: 20,
    },
    checkbox: {
        fontSize: 16,
    },
    clearAll: {
        color: "#ee4d2d",
        fontWeight: "600",
    },
    empty: {
        textAlign: "center",
        marginTop: 40,
        color: "#666",
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
        marginHorizontal: 8,
    },
    price: {
        color: "#ee4d2d",
        fontWeight: "700",
        marginTop: 4,
    },
    qtyRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },
    qtyBtn: {
        width: 28,
        height: 28,
        backgroundColor: "#eee",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
    },
    qtyNumber: {
        marginHorizontal: 10,
        fontWeight: "600",
    },
    remove: {
        fontSize: 18,
        color: "#999",
        paddingLeft: 6,
    },
    footer: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
    },
    total: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 10,
        textAlign: "right",
    },
    buyBtn: {
        backgroundColor: "#ee4d2d",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buyText: {
        color: "#fff",
        fontWeight: "700",
    },
});
