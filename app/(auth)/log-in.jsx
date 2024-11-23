import React from 'react'
import { useRouter, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, TextInput, TouchableOpacity, Image } from "react-native";

const LogIn = () => {
  const router = useRouter();

  const handleLogIn = () => {
    // Here you would typically handle the log-in logic
    // For now, we'll just navigate to the home screen
    router.replace('/home');
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
          {/* Logo */}
          <View className="w-full h-32 mb-8 items-center justify-center">
            <Image
              source={require('../../assets/images/logo.jpg')}
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
            />
          </View>

          <View className="mb-8">
            <Text className="text-gray-700 mb-2 text-lg">Password</Text>
            <TextInput
              className="bg-gray-100 text-gray-800 p-4 rounded-lg border border-gray-300"
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity 
            className="bg-[#007bff] p-4 rounded-lg mb-6"
            onPress={handleLogIn}
          >
            <Text className="text-white text-center text-lg font-bold">Log In</Text>
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
  )
}

export default LogIn