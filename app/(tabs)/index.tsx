import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { getProducts } from "@/services/fakestore.service";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <SearchBar value={keyword} onChange={setKeyword} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => <ProductCard item={item} />}
        contentContainerStyle={{ padding: 6 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
