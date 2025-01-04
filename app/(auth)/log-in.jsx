import React, { useState } from "react";
import { useRouter, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { login } from "../../services/loginApi"; // Path to API file
import { setToken } from "../../hooks/storage";
import { setUserDetails } from "../../hooks/storage";

const LogIn = () => {
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogIn = async () => {
    try {
      setLoading(true);

      // Call login API
      const response = await login({ email, password });
      // const { token } = response;
      const { token, userId, fullName, sabhaId } = response;

      // Decode token separately for console logging
      // const decodedToken = jwtDecode(token);

      // Store token and user details
      // await setUserDetails(token);
      await setToken(token);
      await setUserDetails({ userId, fullName, sabhaId });

      // Print token and decoded details to the console
      // console.log("Stored Token:", token);
      // console.log("Decoded User Details:", decodedToken);
      console.log("Login successful. User details stored.");

      Alert.alert("Success", "Logged in successfully");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Login Failed", error.message || "Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="bg-white">
        <View
          className="w-full flex justify-center h-full px-4 py-10"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <View className="w-full h-32 mb-8 items-center justify-center">
            <Image
              source={require("../../assets/images/logo.jpg")}
              style={{ width: 150, height: 150 }}
              resizeMode="contain"
            />
          </View>

          <Text className="text-3xl font-bold text-[#007bff] mb-10 text-center">
            Log in to CommuniCare
          </Text>

          <View className="mb-6">
            <Text className="text-gray-700 mb-2 text-lg">Email</Text>
            <TextInput
              className="bg-gray-100 text-gray-800 p-4 rounded-lg border border-gray-300"
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="mb-8">
            <Text className="text-gray-700 mb-2 text-lg">Password</Text>
            <TextInput
              className="bg-gray-100 text-gray-800 p-4 rounded-lg border border-gray-300"
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            className="bg-[#007bff] p-4 rounded-lg mb-6"
            onPress={handleLogIn}
            disabled={loading}
          >
            <Text className="text-white text-center text-lg font-bold">
              {loading ? "Logging in..." : "Log In"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center">
            <Text className="text-lg text-gray-700">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-bold text-[#007bff] ml-2"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LogIn;
