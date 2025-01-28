import axios from 'axios';
import { BASE_URL } from '../../constants/config';
const API_BASE_URL = 'http://192.168.8.176:3000';

export const fetchUserComplaints = async (userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/complaint/user/${userId}`,
      { timeout: 10000 } // Add timeout
    );
    return response.data.complaints;
  } catch (error) {
    console.error('API Error Details:', {
      url: `${API_BASE_URL}/complaint/user/${userId}`,
      error: error.response?.data || error.message
    });
    throw error;
  }
};