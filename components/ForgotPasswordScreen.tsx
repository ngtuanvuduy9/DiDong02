import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
    onBackToLogin: () => void;
};

export default function ForgotPasswordScreen({ onBackToLogin }: Props) {
    return (
        <View>
            <Text>Quên mật khẩu</Text>

            <TouchableOpacity onPress={onBackToLogin}>
                <Text>Quay lại đăng nhập</Text>
            </TouchableOpacity>
        </View>
    );
}
