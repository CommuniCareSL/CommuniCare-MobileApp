import * as FileSystem from 'expo-file-system';

/**
 * Converts an image URI to a Base64 string
 * @param {string} imageUri - The URI of the image
 * @returns {Promise<string>} - The Base64 encoded string of the image
 */
export const convertImageToBase64 = async (imageUri) => {
  try {
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64Image;
  } catch (error) {
    console.error('Error converting image to Base64:', error);
    throw error;
  }
};
