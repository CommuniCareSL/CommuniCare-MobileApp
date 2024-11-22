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

// Import the auth service and validation function
import { authService } from '../../services/signupService';
import { validateForm } from '../../utils/signupValidation';  // import validation function

const secondDropdownOptions = {
  'Select': ['Select'],
  'Colombo': ['Homagama', 'Kotikawatta', 'Seethawaka'],
  'Kalutara': ['Agalawatta', 'Beruwela', 'Horana'],
  'Gampaha': ['Attanagalla', 'Biyagama', 'Divulapitiya'],   
};

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

  // Dropdown options
  const firstDropdownOptions = ['Select', 'Colombo', 'Kalutara', 'Gampaha'];

  // Handle Sign Up
  const handleSignUp = async () => {
    // Prepare form data for validation
    const formData = {
      fullName,
      idNumber,
      phoneNumber,
      firstDropdown,
      secondDropdown,
      email,
      password
    };

    // Validate form
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    // If there are errors, return early
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Set loading state
    setIsLoading(true);

    try {
      // Attempt to sign up
      const response = await authService.signUp({
        fullName,
        idNumber,
        phoneNumber,
        district: firstDropdown,
        pradeshiyaSabaha: secondDropdown,
        email,
        password
      });

      // Success handling
      Alert.alert(
        'Success', 
        'You have signed up successfully!',
        [{ 
          text: 'OK', 
          onPress: () => router.replace("/home") 
        }]
      );
    } catch (error) {
      // Error handling
      Alert.alert(
        'Signup Failed', 
        error.message || 'An error occurred during signup'
      );
    } finally {
      // Reset loading state
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
            {errors.district && (
              <Text className="text-red-500 mt-1">{errors.district}</Text>
            )}
          </View>

          {/* Pradeshiya Sabha Dropdown */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 text-lg">Select Your Pradeshiya Sabaha</Text>
            <View className="bg-gray-100 rounded-lg border border-gray-300">
              <Picker
                selectedValue={secondDropdown}
                onValueChange={setSecondDropdown}
                style={{ color: '#333' }}
                enabled={firstDropdown !== 'Select'}
              >
                {secondDropdownOptions[firstDropdown].map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
            {errors.pradeshiyaSabaha && (
              <Text className="text-red-500 mt-1">{errors.pradeshiyaSabaha}</Text>
            )}
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
          
          {/* Back to Login */}
          <View className="mt-6 text-center">
            <Text>
              Already have an account?{' '}
              <Link href="/login" className="text-[#007bff]">Login</Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
