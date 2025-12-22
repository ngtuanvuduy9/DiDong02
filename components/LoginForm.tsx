import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import userApi from "../api/userApi";

type Props = {
  onForgotPassword: () => void;
  onRegister: () => void;
};

export default function LoginForm({
  onForgotPassword,
  onRegister,
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      setLoading(true);

      const res = await userApi.login({ email, password });

      console.log("LOGIN OK:", res.data);
      Alert.alert("Thành công", "Đăng nhập thành công");

    } catch (err: any) {
      Alert.alert(
        "Đăng nhập thất bại",
        err?.response?.data || "Lỗi kết nối server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginText}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onForgotPassword}>
        <Text style={styles.link}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onRegister}>
        <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    color: "#fff",
  },
  loginButton: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  link: {
    color: "#fff",
    textAlign: "center",
    marginTop: 12,
    textDecorationLine: "underline",
  },
});
