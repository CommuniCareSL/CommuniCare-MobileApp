import axios from "axios";
import BASE_URL from "../../constants/config";

const AppointmentService = {
  // Fetch holiday dates
  async getHolidayDates() {
    try {
      const response = await axios.get(`${BASE_URL}/holiday`);
      return response.data; // Assuming the response is an array of dates like ["2025-01-21", "2025-01-24"]
    } catch (error) {
      console.error("Failed to fetch holiday dates:", error);
      throw error;
    }
  },

  // Check availability of time slots for a specific date and service
  checkTimeSlotAvailability: async (sabhaId, departmentId, date) => {
    try {
      const response = await axios.get(`${BASE_URL}/appointment/availability`, {
        params: { sabhaId, departmentId, date }, // Use the correct parameter names
      });
      return response.data; // Assuming the response is an array of booked slots like [8.5, 9.25]
    } catch (error) {
      console.error(
        "Checking time slot availability error:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  // Book an appointment
  bookAppointment: async (bookingData) => {
    try {
      const response = await axios.post(`${BASE_URL}/appointment`, bookingData);
      return response.data;
    } catch (error) {
      console.error(
        "Booking appointment error:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  // Fetch booked appointments for a user
  getUserAppointments: async (userId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/users/${userId}/appointments`,
        {}
      );

      return response.data;
    } catch (error) {
      console.error(
        "Fetching user appointments error:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },
};

export default AppointmentService;
