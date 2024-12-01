import axios from 'axios';
import  BASE_URL  from '../constants/config.ts'; // Assuming you have a config file with BASE_URL

/**
 * Submit a complaint to the backend
 * @param {Object} complaintData - The complaint form data
 * @returns {Promise} - Promise resolving to the backend response
 */
export const submitComplaint = async (complaintData) => {
  try {
    const payload = {
      categoryId: complaintData.categoryId,
      userId: complaintData.sendAnonymous ? 0 : complaintData.userId,
      locationRemarks: complaintData.locationRemarks || '',
      description: complaintData.complaintDescription || '',
      latitude: complaintData.selectedLocation?.latitude || null,
      longitude: complaintData.selectedLocation?.longitude || null,
      images: complaintData.images, // Base64 images
    };

    //console.log("Complaint Payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post(`${BASE_URL}/user/complaints`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      //console.log("Server Response:", response.data);
      return response.data;
    } catch (axiosError) {
      // More detailed axios error logging
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        //console.error("Error Response Data:", axiosError.response.data);
        //console.error("Error Response Status:", axiosError.response.status);
        //console.error("Error Response Headers:", axiosError.response.headers);
      } else if (axiosError.request) {
        // The request was made but no response was received
        console.error("No response received:", axiosError.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error Message:", axiosError.message);
      }
      throw axiosError;
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
    throw error;
  }
};
// Helper function to validate complaint data before submission
export const validateComplaintData = (complaintData) => {
  const errors = [];

  // Check required fields
  if (!complaintData.categoryId) {
    errors.push('Category ID is required');
  }

  if (!complaintData.userId && !complaintData.sendAnonymous) {
    errors.push('User ID is required');
  }

  // Optional: Add more specific validations as needed
  if (complaintData.images && complaintData.images.filter(img => img).length > 3) {
    errors.push('Maximum of 3 images allowed');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};