import React, { useState } from 'react'
import { useRouter, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, TextInput, TouchableOpacity, Image } from "react-native";
import { Picker } from '@react-native-picker/picker';

const SignUp = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstDropdown, setFirstDropdown] = useState('Select');
  const [secondDropdown, setSecondDropdown] = useState('Select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    // Handle sign-up logic here
    console.log('Sign up data:', { fullName, idNumber, phoneNumber, firstDropdown, secondDropdown, email, password });
    // Navigate to home or confirmation page
    router.replace('/home');
  };

  const firstDropdownOptions = ['Select', 'Colombo', 'Kalutara', 'Gampaha'];
  
  const secondDropdownOptions = {
    'Select': ['Select'],
    'Colombo': ['Homagama', '	Kotikawatta', 'Seethawaka'],
    'Kalutara': ['Agalawatta', 'Beruwela', 'Horana'],
    'Gampaha': ['	Attanagalla', 'Biyagama', 'Divulapitiya'],   
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
          <View className="w-full h-12 mb-8 items-center justify-center">
            <Image
              source={require('../../assets/images/logo.jpg')}
              style={{ width: 150, height: 150 }}
              resizeMode="contain"
            />
          </View>

          <Text className="text-2xl font-bold text-[#007bff] mb-5 text-center">
            Sign Up Form
          </Text>

          <View className="mb-6">
            <Text className="text-gray-700 mb-2 text-lg">Full Name</Text>
            <TextInput
              className="bg-gray-100 text-gray-800 p-4 rounded-lg border border-gray-300"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 mb-2 text-lg">Identity Card Number</Text>
            <TextInput
              className="bg-gray-100 text-gray-800 p-4 rounded-lg border border-gray-300"
              placeholder="Enter your ID number"
              value={idNumber}
              onChangeText={setIdNumber}
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 mb-2 text-lg">Phone Number</Text>
            <TextInput
              className="bg-gray-100 text-gray-800 p-4 rounded-lg border border-gray-300"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 mb-2 text-lg">Select Your District</Text>
            <View className="bg-gray-100 rounded-lg border border-gray-300">
              <Picker
                selectedValue={firstDropdown}
                onValueChange={(itemValue) => {
                  setFirstDropdown(itemValue);
                  setSecondDropdown('Select');
                }}
                style={{ color: '#333' }}
              >
                {firstDropdownOptions.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 mb-2 text-lg">Select Your Pradeshiya Sabaha</Text>
            <View className="bg-gray-100 rounded-lg border border-gray-300">
              <Picker
                selectedValue={secondDropdown}
                onValueChange={setSecondDropdown}
                style={{ color: '#333' }}
                enabled={firstDropdown !== 'Select'}
              >
                {(secondDropdownOptions[firstDropdown] || ['Select']).map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 mb-2 text-lg">Email</Text>
            <TextInput
              className="bg-gray-100 text-gray-800 p-4 rounded-lg border border-gray-300"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View className="mb-8">
            <Text className="text-gray-700 mb-2 text-lg">Password</Text>
            <TextInput
              className="bg-gray-100 text-gray-800 p-4 rounded-lg border border-gray-300"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity 
            className="bg-[#007bff] p-4 rounded-lg mb-6"
            onPress={handleSignUp}
          >
            <Text className="text-white text-center text-lg font-bold">Sign Up</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center">
            <Text className="text-lg text-gray-700">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-bold text-[#007bff] ml-2"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp