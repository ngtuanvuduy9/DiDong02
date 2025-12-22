import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
    onBackToLogin: () => void;
};

export default function RegisterForm({ onBackToLogin }: Props) {
    return (
        <View>
            <Text>Đăng ký</Text>

            <TouchableOpacity onPress={onBackToLogin}>
                <Text>Đã có tài khoản? Đăng nhập</Text>
            </TouchableOpacity>
        </View>
    );
}
