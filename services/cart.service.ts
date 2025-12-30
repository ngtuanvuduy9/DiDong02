import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_KEY = "CART_ITEMS";

export type CartItem = {
    id: number;
    title: string;
    price: number;
    mainImage?: string;
    quantity: number;
};

// 👉 Lấy giỏ hàng
export const getCart = async (): Promise<CartItem[]> => {
    const json = await AsyncStorage.getItem(CART_KEY);
    return json ? JSON.parse(json) : [];
};

// 👉 Thêm sản phẩm vào giỏ
export const addToCart = async (product: any) => {
    const cart = await getCart();

    const index = cart.findIndex(item => item.id === product.id);

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
};

// 👉 Xoá giỏ (dùng sau)
export const clearCart = async () => {
    await AsyncStorage.removeItem(CART_KEY);
};
