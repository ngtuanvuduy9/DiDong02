import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function ProductCard({ item }: any) {
    return (
        <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text numberOfLines={2} style={styles.title}>
                {item.title}
            </Text>
            <Text style={styles.price}>${item.price}</Text>
        </TouchableOpacity>
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
});
