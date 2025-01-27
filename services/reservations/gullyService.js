import axios from 'axios';
import BASE_URL from '../../constants/config';

export const submitGullyReservation = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/gully-reservation`, {
      ...payload,
      userId: payload.userId,
      sabhaId: payload.sabhaId,
    });
    return response.data;
  } catch (error) {
    console.error('Reservation failed:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Reservation failed');
  }
};