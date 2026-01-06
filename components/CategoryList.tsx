import { getCategories } from "@/services/api.service";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

type Category = {
    id: number;
    name: string;
};

export default function CategoryList({
    onSelect,
}: {
    onSelect: (categoryId: number | null) => void;
}) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeId, setActiveId] = useState<number | null>(null);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.container}
        >
            {/* Tất cả */}
            <TouchableOpacity
                style={[
                    styles.item,
                    activeId === null && styles.active,
                ]}
                onPress={() => {
                    setActiveId(null);
                    onSelect(null);
                }}
            >
                <Text style={styles.text}>Tất cả</Text>
            </TouchableOpacity>

            {categories.map((c) => (
                <TouchableOpacity
                    key={c.id}
                    style={[
                        styles.item,
                        activeId === c.id && styles.active,
                    ]}
                    onPress={() => {
                        setActiveId(c.id);
                        onSelect(c.id);
                    }}
                >
                    <Text style={styles.text}>{c.name}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        marginVertical: 8,
    },
    item: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: "#e0e0e0",
        borderRadius: 20,
        marginRight: 8,
    },
    active: {
        backgroundColor: "#4caf50",
    },
    text: {
        color: "#000",
        fontSize: 14,
    },
});
