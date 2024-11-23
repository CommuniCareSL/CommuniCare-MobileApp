import { Text, View, Image } from "react-native";
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-gradient-to-b from-sky-100 to-blue-200">
      <StatusBar style="dark" />
      <View className="w-4/5 aspect-square bg-white rounded-full shadow-lg flex items-center justify-center mb-8">
        <Image 
          source={require('../assets/images/logo.jpg')} 
          className="w-3/4 h-3/4 rounded-full"
          resizeMode="cover"
        />
      </View>
      <Text className="text-4xl font-bold text-[#007bff] mb-8 text-center">
        Welcome to CommuniCare
      </Text>
      <Link 
        href="/log-in" 
        className="bg-blue-50 px-8 py-4 rounded-full shadow-md active:bg-blue-100"
      >
        <Text className="text-xl font-semibold text-blue-600">
          Get Started
        </Text>
      </Link>
    </View>
  );
}