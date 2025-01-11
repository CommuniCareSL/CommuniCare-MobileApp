import axios from 'axios';
import BASE_URL from '../constants/config';

// Interface for signup request
interface SignUpData {
  fullName: string;
  idNumber: string;
  phoneNumber: string;
  district: string;
  pradeshiyaSabaha: string;
  email: string;
  password: string;
}

export const authService = {
  async signUp(userData: SignUpData) {
    try {
      console.log("Sign Up Form Data:", userData);
      const response = await axios.post(`${BASE_URL}/user/sign-up`, {
        fullName: userData.fullName,
        idNumber: userData.idNumber,
        phoneNumber: userData.phoneNumber,
        district: userData.district,
        sabhaId: userData.pradeshiyaSabaha,
        email: userData.email,
        password: userData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error: any) {
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        // Backend specific error
        if (error.response) {
          // The request was made and the server responded with a status code
          throw new Error(error.response.data.message || 'Signup failed');
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error('No response from server. Check your network connection.');
        } else {
          // Something happened in setting up the request
          throw new Error('Error setting up the request');
        }
      }
      // Fallback error
      throw new Error('An unexpected error occurred');
    }
  }
};