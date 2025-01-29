import axios from 'axios';
import  BASE_URL  from '../../constants/config';



export const fetchUserComplaints = async (userId) => {
  try {
    const response = await axios.get(
      `${ BASE_URL }/complaint/user/${userId}`,
      { timeout: 10000 } // Add timeout
    );
    return response.data.complaints;
  } catch (error) {
    console.error('API Error Details:', {
      url: `${ABASE_URL}/complaint/user/${userId}`,
      error: error.response?.data || error.message
    });
    throw error;
  }
};