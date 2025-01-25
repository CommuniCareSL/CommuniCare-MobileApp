import axios from "axios";
import BASE_URL from "../../constants/config.ts";

export const fetchHallsBySabhaId = async (sabhaId) => {
  try {
    const response = await axios.get(`${BASE_URL}/hall/sabha/${sabhaId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch community halls:", error);
    throw error;
  }
};

export const fetchBookedDatesByHallId = async (hallId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/hall-reservation/booked-dates/${hallId}`
    );
    return response.data; // Array of booked dates in format ['YYYY-MM-DD', ...]
  } catch (error) {
    console.error("Failed to fetch booked dates:", error);
    throw error;
  }
};

export const submitReservation = async (payload) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/hall-reservation`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Failed to submit reservation:", error);
    throw error;
  }
};
