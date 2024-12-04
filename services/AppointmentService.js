import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for your backend API
import BASE_URL from "../constants/config";

// Function to get the authentication token
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// Service for appointment-related operations
const AppointmentService = {
  // Book an appointment
  bookAppointment: async (bookingData) => {
    try {
      const token = await getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${BASE_URL}/appointments`, bookingData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Booking appointment error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Check availability of time slots for a specific date and service
  checkTimeSlotAvailability: async (serviceId, date) => {
    try {
      const token = await getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${BASE_URL}/appointments/availability`, {
        params: { serviceId, date },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data.bookedSlots || [];
    } catch (error) {
      console.error('Checking time slot availability error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Fetch booked appointments for a user
  getUserAppointments: async (userId) => {
    try {
      const token = await getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${BASE_URL}/users/${userId}/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Fetching user appointments error:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
};

export default AppointmentService;