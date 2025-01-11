import axios from "axios";
import BASE_URL from "../../constants/config.ts";

export const fetchGroundsBySabhaId = async (sabhaId) => {
  try {
    const response = await axios.get(`${BASE_URL}/ground/sabha/${sabhaId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch grounds:", error);
    throw error;
  }
};

export const fetchBookedDatesByGroundId = async (groundId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/ground-reservation/booked-dates/${groundId}`
    );
    return response.data; // Array of booked dates in format ['YYYY-MM-DD', ...]
  } catch (error) {
    console.error("Failed to fetch booked dates:", error);
    throw error;
  }
};
