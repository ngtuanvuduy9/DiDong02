import { CART_KEY, FAVORITE_KEY } from "@/constants/storage";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProductCard({ item }: any) {
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);

    /* 🔥 KIỂM TRA SP CÓ TRONG FAVORITE KHÔNG */
    useEffect(() => {
        checkFavorite();
    }, []);

    const checkFavorite = async () => {
        const json = await AsyncStorage.getItem(FAVORITE_KEY);
        const favorites = json ? JSON.parse(json) : [];
        const exists = favorites.some((p: any) => p.id === item.id);
        setIsFavorite(exists);
    };

    const goDetail = () => {
        router.push({
            pathname: "/product/[id]",
            params: { id: item.id },
        });
    };

    /* 🛒 THÊM GIỎ */
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

    /* ❤️ TOGGLE FAVORITE */
    const toggleFavorite = async () => {
        const json = await AsyncStorage.getItem(FAVORITE_KEY);
        let favorites = json ? JSON.parse(json) : [];

        if (isFavorite) {
            // ❌ XOÁ
            favorites = favorites.filter((p: any) => p.id !== item.id);
            setIsFavorite(false);
        } else {
            // ✅ THÊM
            favorites.push({
                id: item.id,
                title: item.title,
                price: item.price,
                mainImage: item.mainImage,
            });
            setIsFavorite(true);
        }

        await AsyncStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
    };

    return (
        <View style={styles.card}>
            {/* ❤️ ICON */}
            <TouchableOpacity
                style={styles.favoriteIcon}
                onPress={toggleFavorite}
            >
                <Ionicons
                    name={isFavorite ? "heart" : "heart-outline"}
                    size={22}
                    color="red"
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={goDetail}>
                <Image
                    source={{
                        uri:
                            item.mainImage ||
                            "https://via.placeholder.com/150",
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
        position: "relative",
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
    favoriteIcon: {
        position: "absolute",
        top: 8,
        right: 8,
        zIndex: 10,
    },
});
