import axios from 'axios';

import  BASE_URL  from '../constants/config.ts';

const AppointmentService = {
  bookAppointment: async (bookingDetails) => {
    try {
      const response = await axios.post(`${BASE_URL}/appointments/book`, bookingDetails);
      return response.data;
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  },

  getAppointmentsByUser: async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/appointments/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      throw error;
    }
  },

  checkTimeSlotAvailability: async (date, timeSlots) => {
    try {
      const response = await axios.post(`${BASE_URL}/appointments/check-availability`, { date, timeSlots });
      return response.data;
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      throw error;
    }
  }
};

export default AppointmentService;