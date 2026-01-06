import CategoryList from "@/components/CategoryList";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import {
  getProducts,
  getProductsByCategory,
} from "@/services/api.service";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleCategorySelect = async (categoryId: number | null) => {
    if (categoryId === null) {
      loadAllProducts();
    } else {
      const data = await getProductsByCategory(categoryId);
      setProducts(data);
    }
  };

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => <ProductCard item={item} />}
        contentContainerStyle={{ padding: 6 }}

        /* 🔥 HEADER CHUẨN */
        ListHeaderComponent={
          <>
            <CategoryList onSelect={handleCategorySelect} />
            <SearchBar value={keyword} onChange={setKeyword} />
          </>
        }
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
