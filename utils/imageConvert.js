/**
 * Convert image to base64 format
 * @param {string} imageUri - URI of the image to convert
 * @returns {Promise<string|null>} - Base64 string or null on failure
 */
export const convertImageToBase64 = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
  
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result.split(",")[1]; // Remove "data:image/jpeg;base64,"
          resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return null;
    }
  };
  