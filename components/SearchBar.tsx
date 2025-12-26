import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

export default function SearchBar({
    value,
    onChange,
}: {
    value: string;
    onChange: (t: string) => void;
}) {
    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
                placeholder="Tìm kiếm sản phẩm"
                value={value}
                onChangeText={onChange}
                style={styles.input}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        margin: 10,
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
});
