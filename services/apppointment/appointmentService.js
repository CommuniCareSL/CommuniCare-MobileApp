import axios from 'axios';
import BASE_URL from "../../constants/config";


// Service for appointment-related operations
const AppointmentService = {
  // Book an appointment
  bookAppointment: async (bookingData) => {
    try {
      

      const response = await axios.post(`${BASE_URL}/appointments`, bookingData, {
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

      const response = await axios.get(`${BASE_URL}/appointments/availability`, {
        params: { serviceId, date }
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

      const response = await axios.get(`${BASE_URL}/users/${userId}/appointments`, {

      });

      return response.data;
    } catch (error) {
      console.error('Fetching user appointments error:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
};

export default AppointmentService;