import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const FAVORITE_KEY = "FAVORITE_ITEMS";

export default function FavoriteScreen() {
    const [items, setItems] = useState<any[]>([]);
    const router = useRouter();

    const loadFavorite = async () => {
        const json = await AsyncStorage.getItem(FAVORITE_KEY);
        setItems(json ? JSON.parse(json) : []);
    };

    useFocusEffect(
        useCallback(() => {
            loadFavorite();
        }, [])
    );

    // ❌ XOÁ 1 SP
    const removeItem = async (id: number) => {
        const json = await AsyncStorage.getItem(FAVORITE_KEY);
        const fav = json ? JSON.parse(json) : [];

        const newFav = fav.filter((item: any) => item.id !== id);

        await AsyncStorage.setItem(FAVORITE_KEY, JSON.stringify(newFav));
        setItems(newFav);
    };

    // 🧹 XOÁ TẤT CẢ
    const clearAll = async () => {
        await AsyncStorage.removeItem(FAVORITE_KEY);
        setItems([]);
    };

    const goDetail = (id: number) => {
        router.push({
            pathname: "/product/[id]",
            params: { id },
        });
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                {/* 👈 QUAY LẠI */}
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.back}>← Quay lại</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Yêu thích</Text>

                {items.length > 0 ? (
                    <TouchableOpacity onPress={clearAll}>
                        <Text style={styles.clearAll}>Xoá tất cả</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 70 }} />
                )}
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                    <Text style={{ textAlign: "center", marginTop: 40 }}>
                        Chưa có sản phẩm yêu thích ❤️
                    </Text>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => goDetail(item.id)}
                    >
                        <Image
                            source={{
                                uri:
                                    item.mainImage ||
                                    "https://via.placeholder.com/100",
                            }}
                            style={styles.image}
                        />

                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={2} style={styles.title}>
                                {item.title}
                            </Text>

                            <Text style={styles.price}>
                                {item.price.toLocaleString()} ₫
                            </Text>
                        </View>

                        {/* ❌ */}
                        <TouchableOpacity onPress={() => removeItem(item.id)}>
                            <Text style={styles.remove}>✕</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
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
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
        padding: 20,
    },
    back: {
        fontSize: 14,
        color: "#007bff",
        fontWeight: "600",
        width: 70,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
    },
    clearAll: {
        color: "#ee4d2d",
        fontSize: 14,
        fontWeight: "600",
        width: 70,
        textAlign: "right",
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
    title: {
        fontSize: 14,
    },
    price: {
        color: "#ee4d2d",
        fontWeight: "700",
        marginTop: 4,
    },
    remove: {
        fontSize: 18,
        color: "#999",
        paddingLeft: 6,
    },
});
