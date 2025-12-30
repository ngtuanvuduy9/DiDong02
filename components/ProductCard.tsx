import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";



const CART_KEY = "CART_ITEMS";

export default function ProductCard({ item }: any) {
    const router = useRouter();

    const goDetail = () => {
        router.push({
            pathname: "/product/[id]",
            params: { id: item.id },
        });
    };

    const addToCart = async () => {
        const json = await AsyncStorage.getItem(CART_KEY);
        const cart = json ? JSON.parse(json) : [];

        const index = cart.findIndex((p: any) => p.id === item.id);

        if (index !== -1) {
            cart[index].quantity += 1;
        } else {
            cart.push({
                id: item.id,
                title: item.title,
                price: item.price,
                mainImage: item.mainImage,
                quantity: 1,
            });
        }

        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
        alert("Đã thêm vào giỏ hàng 🛒");
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={goDetail}>
                <Image
                    source={{
                        uri: item.mainImage || "https://via.placeholder.com/150",
                    }}
                    style={styles.image}
                />
                <Text numberOfLines={2} style={styles.title}>
                    {item.title}
                </Text>
                <Text style={styles.price}>
                    {item.price.toLocaleString()} ₫
                </Text>
            </TouchableOpacity>

            {/* 👉 BUTTON */}
            <TouchableOpacity style={styles.cartBtn} onPress={addToCart}>
                <Text style={styles.cartText}>Thêm vào giỏ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.detailBtn} onPress={goDetail}>
                <Text style={styles.detailText}>Xem chi tiết</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 10,
        flex: 1,
        margin: 6,
    },
    image: {
        height: 120,
        resizeMode: "contain",
        marginBottom: 8,
    },
    title: {
        fontSize: 13,
        height: 36,
    },
    price: {
        marginTop: 6,
        color: "#ee4d2d",
        fontWeight: "700",
    },
    detailBtn: {
        marginTop: 8,
        backgroundColor: "#007bff",
        paddingVertical: 6,
        borderRadius: 6,
        alignItems: "center",
    },
    detailText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    cartBtn: {
        marginTop: 6,
        backgroundColor: "#ee4d2d",
        paddingVertical: 6,
        borderRadius: 6,
        alignItems: "center",
    },
    cartText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

});
