//signup api(not used)
import axios from 'axios';
import { MMKV } from 'react-native-mmkv';

// Create MMKV storage instance
export const storage = new MMKV();

// Base URL for your backend API
const BASE_URL = 'http://192.168.8.176:3000'; // Replace with your actual backend IP/URL

// Define the shape of signup request
interface SignUpRequest {
  fullName: string;
  idNumber: string;
  phoneNumber: string;
  district: string;
  pradeshiyaSabha: string;
  email: string;
  password: string;
}

// API service for user-related operations
export const UserService = {
  async signUp(userData: SignUpRequest) {
    try {
      const response = await axios.post(`${BASE_URL}/sign-up`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Store user token if received
      if (response.data.token) {
        storage.set('userToken', response.data.token);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Sign up failed. Please try again.'
        );
      }
      throw error;
    }
  },

  // Helper method to check if user is logged in
  isLoggedIn(): boolean {
    return !!storage.getString('userToken');
  },

  // Method to get stored token
  getToken(): string | null {
    const token = storage.getString('userToken');
    return token !== undefined ? token : null; // Convert undefined to null
  },

  // Method to logout and clear token
  logout() {
    try {
      if (storage.contains('userToken')) {
        storage.delete('userToken'); // Clear token if it exists
      }
    } catch (error) {
      console.error('Error during logout:', error); // Log error for debugging
    }
  },
};


// import API_BASE_URL from "../constants/config";

// export const signUp = async (userData: Record<string, any>) => {
//   try {
//     console.log("Form data being sent to the API:", userData);
//     const response = await fetch(`${API_BASE_URL}/users/signup`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(userData),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || "Failed to sign up");
//     }

//     return await response.json(); // Assuming backend sends user data or a token
//   } catch (error: any) {
//     throw new Error(error.message || "Something went wrong");
//   }
// };
