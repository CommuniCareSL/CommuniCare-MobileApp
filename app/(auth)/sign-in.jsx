import React from 'react'
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, TextInput, TouchableOpacity } from "react-native";

const SignIn = () => {
  return (
    <SafeAreaView className="bg-blue-900 h-full">
      <ScrollView className="bg-blue-800">
        <View
          className="w-full flex justify-center h-full px-4 py-10"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          {/* Logo Placeholder */}
          <View className="w-full h-32 mb-8 items-center justify-center">
            <View className="w-32 h-32 bg-blue-700 rounded-full items-center justify-center">
              <Text className="text-blue-100 text-xl font-bold">LOGO</Text>
            </View>
          </View>

          <Text className="text-3xl font-bold text-blue-100 mb-10 text-center">
            Log in to CommuniCare
          </Text>

          <View className="mb-6">
            <Text className="text-blue-200 mb-2 text-lg">Email</Text>
            <TextInput
              className="bg-blue-700 text-blue-100 p-4 rounded-lg"
              placeholder="Enter your email"
              placeholderTextColor="#93c5fd"
              keyboardType="email-address"
            />
          </View>

          <View className="mb-8">
            <Text className="text-blue-200 mb-2 text-lg">Password</Text>
            <TextInput
              className="bg-blue-700 text-blue-100 p-4 rounded-lg"
              placeholder="Enter your password"
              placeholderTextColor="#93c5fd"
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity className="bg-blue-500 p-4 rounded-lg mb-6">
            <Text className="text-white text-center text-lg font-bold">Sign In</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center">
            <Text className="text-lg text-blue-200">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-bold text-blue-300 ml-2"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn

{/* <Link href="/sign-up">Click to Sign Up Page</Link>
      <Link href="/home">Click to Home Page</Link> */}