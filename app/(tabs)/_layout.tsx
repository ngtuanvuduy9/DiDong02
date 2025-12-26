import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{ title: "Trang chủ" }}
      />
      {/* <Tabs.Screen
        name="cart"
        options={{ title: "Giỏ hàng" }}
      /> */}

      <Tabs.Screen
        name="profile"
        options={{ title: "Tôi" }}
      />
    </Tabs>
  );
}
