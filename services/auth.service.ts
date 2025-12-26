// import AsyncStorage from "@react-native-async-storage/async-storage";

// const USERS_KEY = "users";
// const CURRENT_USER_KEY = "currentUser";

// // REGISTER
// export const register = async (
//     name: string,
//     email: string,
//     password: string
// ) => {
//     const users = JSON.parse(
//         (await AsyncStorage.getItem(USERS_KEY)) || "[]"
//     );

//     const exists = users.find((u: any) => u.email === email);
//     if (exists) {
//         throw new Error("Email đã tồn tại");
//     }

//     const newUser = {
//         id: Date.now(),
//         name,
//         email,
//         password, // mock → không hash
//     };

//     users.push(newUser);
//     await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

//     return newUser;
// };

// // LOGIN
// export const login = async (email: string, password: string) => {
//     const users = JSON.parse(
//         (await AsyncStorage.getItem(USERS_KEY)) || "[]"
//     );

//     const user = users.find(
//         (u: any) => u.email === email && u.password === password
//     );

//     if (!user) {
//         throw new Error("Sai email hoặc mật khẩu");
//     }

//     await AsyncStorage.setItem(
//         CURRENT_USER_KEY,
//         JSON.stringify(user)
//     );

//     return user;
// };

// // GET CURRENT USER
// export const getCurrentUser = async () => {
//     const user = await AsyncStorage.getItem(CURRENT_USER_KEY);
//     return user ? JSON.parse(user) : null;
// };

// // LOGOUT
// export const logout = async () => {
//     await AsyncStorage.removeItem(CURRENT_USER_KEY);
// };
