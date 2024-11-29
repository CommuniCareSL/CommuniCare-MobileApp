import React, { useState } from 'react';
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
  ActivityIndicator
} from "react-native";
import { Picker } from '@react-native-picker/picker';

// Import dropdown options
import { firstDropdownOptions, secondDropdownOptions } from '../../data/districtSabha';
import { authService } from '../../services/signupService';
import { validateForm } from '../../utils/signupValidation';

const SignUp = () => {
  const router = useRouter();
  
  // State for form fields
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstDropdown, setFirstDropdown] = useState('Select');
  const [secondDropdown, setSecondDropdown] = useState('Select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Loading state for signup process
  const [isLoading, setIsLoading] = useState(false);
  
  // Error state for form validation
  const [errors, setErrors] = useState({});

  // Handle Sign Up
  const handleSignUp = async () => {
    const formData = {
      fullName,
      idNumber,
      phoneNumber,
      district: firstDropdown,
      pradeshiyaSabaha: secondDropdown, // Now passing the ID instead of the name
      email,
      password
    };

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);

    try {
      const response = await authService.signUp({
        fullName,
        idNumber,
        phoneNumber,
        district: firstDropdown,
        pradeshiyaSabaha: secondDropdown,
        email,
        password
      });

      Alert.alert(
        'Success', 
        'You have signed up successfully!',
        [{ 
          text: 'OK', 
          onPress: () => router.replace("/home") 
        }]
      );
    } catch (error) {
      Alert.alert(
        'Signup Failed', 
        error.message || 'An error occurred during signup'
      );
    } finally {
      setIsLoading(false);
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

          {/* Full Name Field */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 text-lg">Full Name</Text>
            <TextInput
              className="bg-gray-100 text-gray-800 p-4 rounded-lg border border-gray-300"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
            />
            {errors.fullName && (
              <Text className="text-red-500 mt-1">{errors.fullName}</Text>
            )}
          </View>

          {/* ID Number Field */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 text-lg">Identity Card Number</Text>
            <TextInput
              className="bg-gray-100 text-gray-800 p-4 rounded-lg border border-gray-300"
              placeholder="Enter your ID number"
              value={idNumber}
              onChangeText={setIdNumber}
            />
            {errors.idNumber && (
              <Text className="text-red-500 mt-1">{errors.idNumber}</Text>
            )}
          </View>

          {/* Phone Number Field */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 text-lg">Phone Number</Text>
            <TextInput
              className="bg-gray-100 text-gray-800 p-4 rounded-lg border border-gray-300"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            {errors.phoneNumber && (
              <Text className="text-red-500 mt-1">{errors.phoneNumber}</Text>
            )}
          </View>

        {/* District Dropdown */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2 text-lg">Select Your District</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#ccc', // Neutral border color
              borderRadius: 8,
              backgroundColor: '#f9f9f9',
              paddingVertical: 0, // Remove extra padding
              overflow: 'hidden',
            }}
          >
            <Picker
              selectedValue={firstDropdown}
              onValueChange={(itemValue) => {
                setFirstDropdown(itemValue);
                setSecondDropdown('Select'); // Reset second dropdown
              }}
              style={{
                height: 55, // Fixed height for visibility
                color: '#333', // Ensure text is readable
              }}
              dropdownIconColor="#ccc" // Change dropdown arrow color to match border
              mode="dropdown" // Dropdown mode instead of default dialog
            >
              {/* Single "Select" placeholder */}
              <Picker.Item label="Select" value="Select" />
              {firstDropdownOptions
                .filter((option) => option.name !== 'Select') // Remove duplicate "Select"
                .map((option) => (
                  <Picker.Item key={option.districtid} label={option.name} value={option.name} />
                ))}
            </Picker>
          </View>
          {errors.district && <Text style={{ color: 'red', marginTop: 5 }}>{errors.district}</Text>}
        </View>

        {/* Pradeshiya Sabha Dropdown */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2 text-lg">Select Your Pradeshiya Sabha</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: firstDropdown !== 'Select' ? '#ccc' : '#e9e9e9',
              borderRadius: 8,
              backgroundColor: firstDropdown !== 'Select' ? '#f9f9f9' : '#e9e9e9',
              overflow: 'hidden',
            }}
          >
            <Picker
              selectedValue={secondDropdown} // This will store the selected Sabha ID
              onValueChange={setSecondDropdown} // Set the selected Sabha ID
              style={{
                height: 60,
                color: firstDropdown !== 'Select' ? '#333' : '#aaa',
              }}
              dropdownIconColor="#ccc"
              mode="dropdown"
              enabled={firstDropdown !== 'Select'}
            >
              <Picker.Item label="Select" value="Select" />
              {firstDropdown !== 'Select' &&
                secondDropdownOptions[firstDropdown]?.map((option) => (
                  <Picker.Item key={option.id} label={option.name} value={option.id} />
                ))}
            </Picker>
          </View>
          {errors.pradeshiyaSabaha && <Text style={{ color: 'red', marginTop: 5 }}>{errors.pradeshiyaSabaha}</Text>}
        </View>


          {/* Email Field */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 text-lg">Email</Text>
            <TextInput
              className="bg-gray-100 text-gray-800 p-4 rounded-lg border border-gray-300"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            {errors.email && (
              <Text className="text-red-500 mt-1">{errors.email}</Text>
            )}
          </View>

          {/* Password Field */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 text-lg">Password</Text>
            <TextInput
              className="bg-gray-100 text-gray-800 p-4 rounded-lg border border-gray-300"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {errors.password && (
              <Text className="text-red-500 mt-1">{errors.password}</Text>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            className="w-full bg-[#007bff] p-4 rounded-lg items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-lg">Sign Up</Text>
            )}
          </TouchableOpacity>
          
          <View className="flex-row justify-center items-center">
            <Text className="text-lg text-gray-700">
              Already have an account?
            </Text>
            <Link
              href="/log-in"
              className="text-lg font-bold text-[#007bff] ml-2"
            >
              LogIn
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
