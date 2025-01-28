import axios from 'axios';
import { API_BASE_URL } from '../../constants/config';

export const fetchUserAppointments = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/appointment/user`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};