import axios from 'axios';
import BASE_URL from '../constants/config'; 

/**
 * Submit a playground reservation to the backend
 * @param {Object} reservationData - The reservation form data (including reservationId)
 * @returns {Promise} - Promise resolving to the backend response
 */
export const submitReservation = async (reservationData) => {
  try {
    // Prepare the payload with userId as Integer and dynamic reservationId
    const payload = {
      ...reservationData,
      userId: parseInt(reservationData.userId, 10),  // Ensure userId is passed as Integer
      reservationId: parseInt(reservationData.reservationId, 10),  // Ensure reservationId is passed as Integer
      date: reservationData.date, // Ensure date format is correct
    };

    // Log the payload to ensure it's correctly structured
    console.log('Payload to backend:', payload);

    // Send the POST request to the backend with the reservation data
    const response = await axios.post(`${BASE_URL}/user/reservations`, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    });

    // Return the backend response
    return response.data;
  } catch (error) {
    console.error("Error submitting reservation:", error.response || error.message);
    throw error;
  }
};


