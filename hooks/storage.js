import * as SecureStore from "expo-secure-store";

// Store the raw token
export const setToken = async (token) => {
  try {
    await SecureStore.setItemAsync("authToken", token);
    console.log("Token stored successfully!");
  } catch (error) {
    console.error("Error storing token:", error);
    throw error;
  }
};

// Retrieve the raw token for API calls
export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync("authToken");
  } catch (error) {
    console.error("Error retrieving token:", error);
    throw error;
  }
};

// Store user details
export const setUserDetails = async (details) => {
  try {
    await SecureStore.setItemAsync("userDetails", JSON.stringify(details));
    console.log("User details stored successfully!");
  } catch (error) {
    console.error("Error storing user details:", error);
    throw error;
  }
};

// Retrieve user details
//    "userId": 3,"fullName": "Ashen Sachinthana","sabhaId": 1
export const getUserDetails = async () => {
  try {
    const userDetails = await SecureStore.getItemAsync("userDetails");
    return userDetails ? JSON.parse(userDetails) : null;
  } catch (error) {
    console.error("Error retrieving user details:", error);
    throw error;
  }
};

// Clear all stored data (logout)
export const clearUserData = async () => {
  try {
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("userDetails");
    console.log("User data cleared successfully!");
  } catch (error) {
    console.error("Error clearing user data:", error);
    throw error;
  }
};
