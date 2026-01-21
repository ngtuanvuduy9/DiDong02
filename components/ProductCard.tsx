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

    /* =======================
       CHECK FAVORITE
    ======================= */
    useEffect(() => {
        checkFavorite();
    }, []);

    const checkFavorite = async () => {
        const json = await AsyncStorage.getItem(FAVORITE_KEY);
        const favorites = json ? JSON.parse(json) : [];
        setIsFavorite(favorites.some((p: any) => p.id === item.id));
    };

    /* =======================
       NAVIGATE
    ======================= */
    const goDetail = () => {
        router.push({
            pathname: "/product/[id]",
            params: { id: item.id },
        });
    };

    /* =======================
       ADD TO CART
    ======================= */
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

    /* =======================
       BUY NOW 🔥
    ======================= */
    /* =======================
       BUY NOW 🔥 (FIXED)
    ======================= */
    const buyNow = async () => {
        const json = await AsyncStorage.getItem(CART_KEY);
        let cart = json ? JSON.parse(json) : [];

        const index = cart.findIndex((p: any) => p.id === item.id);

        if (index === -1) {
            // ❗ Chưa có trong cart → thêm tạm
            cart.push({
                id: item.id,
                title: item.title,
                price: item.price,
                mainImage: item.mainImage,
                quantity: 1,
            });

            await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
        }

        router.push({
            pathname: "/checkout",
            params: {
                ids: JSON.stringify([item.id]),
            },
        });
    };
    /* =======================
       TOGGLE FAVORITE
    ======================= */
    const toggleFavorite = async () => {
        const json = await AsyncStorage.getItem(FAVORITE_KEY);
        let favorites = json ? JSON.parse(json) : [];

        if (isFavorite) {
            favorites = favorites.filter((p: any) => p.id !== item.id);
            setIsFavorite(false);
        } else {
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
            {/* ❤️ FAVORITE */}
            <TouchableOpacity style={styles.favoriteIcon} onPress={toggleFavorite}>
                <Ionicons
                    name={isFavorite ? "heart" : "heart-outline"}
                    size={22}
                    color="red"
                />
            </TouchableOpacity>

            {/* IMAGE + INFO */}
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

            {/* ACTION BUTTONS */}
            <View style={styles.actionRow}>
                {/* ADD CART */}
                <TouchableOpacity style={styles.cartBtn} onPress={addToCart}>
                    <Ionicons name="cart-outline" size={18} color="#fff" />
                </TouchableOpacity>

                {/* BUY NOW */}
                <TouchableOpacity style={styles.buyBtn} onPress={buyNow}>
                    <Ionicons name="flash" size={18} color="#fff" />
                    <Text style={styles.buyText}>Mua ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

/* =======================
   STYLES
======================= */
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
    favoriteIcon: {
        position: "absolute",
        top: 8,
        right: 8,
        zIndex: 10,
    },
    actionRow: {
        flexDirection: "row",
        gap: 6,
        marginTop: 8,
    },
    cartBtn: {
        backgroundColor: "#6c757d",
        padding: 8,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
    },
    buyBtn: {
        flex: 1,
        flexDirection: "row",
        gap: 4,
        backgroundColor: "#ee4d2d",
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
    },
    buyText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },
});
