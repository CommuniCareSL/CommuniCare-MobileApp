import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const getUserRecords = async () => {
  const userId = await SecureStore.getItemAsync('userId');
  try {
    const response = await axios.get(`https://your-backend-url/api/user/records?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching records:', error);
    return { complaints: [], reservations: [] };
  }
};

export default { getUserRecords };
