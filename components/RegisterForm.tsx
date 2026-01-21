import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { register } from "../services/user.service";

type Props = {
    onBackToLogin: () => void;
};

export default function RegisterForm({ onBackToLogin }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    /* =======================
       VALIDATE
    ======================= */
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isValidPassword = (password: string) => {
        return password.length >= 6 && /[a-zA-Z]/.test(password);
    };

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert("Lỗi", "Email không đúng định dạng");
            return;
        }

        if (!isValidPassword(password)) {
            Alert.alert(
                "Lỗi",
                "Mật khẩu phải có ít nhất 6 ký tự và chứa chữ cái"
            );
            return;
        }

        try {
            await register(name, email, password);
            Alert.alert("Thành công", "Đăng ký thành công");
            onBackToLogin();
        } catch (err: any) {
            Alert.alert("Lỗi", err.message || "Đăng ký thất bại");
        }
    };

    return (
        <View>
            <Text style={styles.title}>Đăng ký</Text>

            <TextInput
                placeholder="Họ tên"
                style={styles.input}
                value={name}
                onChangeText={setName}
            />

            <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                placeholder="Mật khẩu"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 14,
        backgroundColor: "#fafafa",
    },
    button: {
        backgroundColor: "#ee4d2d",
        paddingVertical: 14,
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "700",
        fontSize: 16,
    },
});
