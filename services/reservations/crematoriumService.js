import axios from "axios";
import BASE_URL from "../../constants/config";

export const fetchCrematoriumsBySabhaId = async (sabhaId) => {
  try {
    const response = await axios.get(`${BASE_URL}/crematorium/sabha/${sabhaId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch crematoriums:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch crematoriums");
  }
};

export const fetchBookedSlots = async (crematoriumId, date) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/crematorium-reservation/booked-slots/${crematoriumId}`,
      { params: { date } }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch booked slots:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch available slots");
  }
};

export const submitCrematoriumReservation = async (payload) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/crematorium-reservation`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Reservation failed:", error.response?.data);
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      "Reservation submission failed"
    );
  }
};