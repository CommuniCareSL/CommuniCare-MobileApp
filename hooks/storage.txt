import * as SecureStore from "expo-secure-store";
import { jwtDecode } from 'jwt-decode';  // Changed to named import

// Store the token and decoded user details in SecureStore
export const setUserDetails = async (token) => {
  try {
    const decoded = jwtDecode(token); // Using named import

    // Store the raw token and decoded user details
    await SecureStore.setItemAsync("authToken", token);
    await SecureStore.setItemAsync("userDetails", JSON.stringify(decoded));

    console.log("User details stored successfully!");
    return decoded;
  } catch (error) {
    console.error("Error storing user details:", error);
    throw error;
  }
};

// Retrieve the user details from SecureStore
export const getUserDetails = async () => {
  try {
    const userDetails = await SecureStore.getItemAsync("userDetails");
    return userDetails ? JSON.parse(userDetails) : null;
  } catch (error) {
    console.error("Error retrieving user details:", error);
    throw error;
  }
};

// Retrieve the raw token for API calls
export const getToken = async () => {
  return await SecureStore.getItemAsync("authToken");
};

// Clear all stored data (logout)
export const clearUserData = async () => {
  try {
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("userDetails");
  } catch (error) {
    console.error("Error clearing user data:", error);
    throw error;
  }
};

// import * as SecureStore from 'expo-secure-store';

// export const setToken = async (key, value) => {
//     await SecureStore.setItemAsync(key, value);
// };

// export const getToken = async (key) => {
//     return await SecureStore.getItemAsync(key);
// };

// export const deleteToken = async (key) => {
//     await SecureStore.deleteItemAsync(key);
// };






