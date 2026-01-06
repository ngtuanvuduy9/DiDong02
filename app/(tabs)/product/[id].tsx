import {
    getAuthors,
    getCategories,
    getProductById,
    getPublishers,
} from "@/services/api.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const CART_KEY = "CART_ITEMS";

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [product, setProduct] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const [publishers, setPublishers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    /* ================= LOAD DATA ================= */
    useEffect(() => {
        const loadData = async () => {
            try {
                const productData = await getProductById(Number(id));
                const categoryData = await getCategories();
                const authorData = await getAuthors();
                const publisherData = await getPublishers();

                setProduct(productData);        // ⚠️ KHÔNG .data
                setCategories(categoryData);
                setAuthors(authorData);
                setPublishers(publisherData);
            } catch (error) {
                console.error("Load product failed:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) loadData();
    }, [id]);

    /* ================= HELPER ================= */
    const getCategoryName = (id: number) =>
        categories.find(c => c.id === id)?.name || "—";

    const getAuthorName = (id: number) =>
        authors.find(a => a.id === id)?.name || "—";

    const getPublisherName = (id: number) =>
        publishers.find(p => p.id === id)?.name || "—";

    /* ================= ADD TO CART ================= */
    const addToCart = async () => {
        const json = await AsyncStorage.getItem(CART_KEY);
        const cart = json ? JSON.parse(json) : [];

        const index = cart.findIndex((p: any) => p.id === product.id);

        if (index !== -1) {
            cart[index].quantity += 1;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                mainImage: product.mainImage,
                quantity: 1,
            });
        }

        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
        alert("Đã thêm vào giỏ hàng 🛒");
    };

    /* ================= UI STATE ================= */
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.center}>
                <Text>Không tìm thấy sản phẩm</Text>
            </View>
        );
    }

    const stockStatus =
        product.quantity > 10
            ? "✅ Còn hàng"
            : product.quantity > 0
                ? "⚠️ Sắp hết"
                : "❌ Hết hàng";

    /* ================= RENDER ================= */
    return (
        <ScrollView style={styles.container}>
            <Image
                source={{
                    uri: product.mainImage || "https://via.placeholder.com/300",
                }}
                style={styles.image}
            />

            <View style={styles.content}>
                <Text style={styles.title}>{product.title}</Text>

                <Text style={styles.price}>
                    {product.price?.toLocaleString()} ₫
                </Text>

                <Text style={styles.stock}>
                    Số lượng tồn: {product.quantity}
                </Text>

                {/* ===== THÔNG TIN ===== */}
                <View style={styles.infoBox}>
                    <Text style={styles.info}>📘 ISBN: {product.isbn}</Text>

                    <Text style={styles.info}>
                        📂 Danh mục: {getCategoryName(product.categoryId)}
                    </Text>

                    <Text style={styles.info}>
                        ✍️ Tác giả: {getAuthorName(product.authorId)}
                    </Text>

                    <Text style={styles.info}>
                        🏢 NXB: {getPublisherName(product.publisherId)}
                    </Text>

                    <Text style={styles.info}>
                        📅 Xuất bản:{" "}
                        {product.publishedDate
                            ? new Date(product.publishedDate).toLocaleDateString()
                            : "—"}
                    </Text>

                    <Text
                        style={[
                            styles.status,
                            product.isActive ? styles.active : styles.inactive,
                        ]}
                    >
                        {product.isActive ? "🟢 Đang bán" : "🔴 Ngừng bán"}
                    </Text>

                    <Text style={styles.stockStatus}>{stockStatus}</Text>
                </View>

                <Text style={styles.desc}>
                    {product.description || "Chưa có mô tả"}
                </Text>

                <TouchableOpacity
                    style={[
                        styles.btn,
                        product.quantity === 0 && styles.btnDisabled,
                    ]}
                    disabled={product.quantity === 0}
                    onPress={addToCart}
                >
                    <Text style={styles.btnText}>
                        {product.quantity === 0
                            ? "Hết hàng"
                            : "Thêm vào giỏ hàng"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.btn, styles.backBtn]}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backText}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    image: {
        width: "100%",
        height: 300,
        resizeMode: "contain",
        backgroundColor: "#f5f5f5",
    },
    content: { padding: 16 },
    title: { fontSize: 18, fontWeight: "700" },
    price: {
        fontSize: 20,
        fontWeight: "700",
        color: "#ee4d2d",
        marginVertical: 8,
    },
    stock: { color: "#555", marginBottom: 8 },
    infoBox: {
        backgroundColor: "#fafafa",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    info: { fontSize: 14, color: "#444", marginBottom: 6 },
    status: { marginTop: 6, fontWeight: "700" },
    active: { color: "green" },
    inactive: { color: "red" },
    stockStatus: { marginTop: 6, fontWeight: "600" },
    desc: { fontSize: 14, color: "#333", lineHeight: 20, marginTop: 8 },
    btn: {
        marginTop: 16,
        backgroundColor: "#ee4d2d",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    btnDisabled: { backgroundColor: "#ccc" },
    btnText: { color: "#fff", fontWeight: "700" },
    backBtn: { backgroundColor: "#eee" },
    backText: { color: "#333", fontWeight: "600" },
});
