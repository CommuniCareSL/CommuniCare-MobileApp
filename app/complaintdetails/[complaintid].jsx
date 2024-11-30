import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Switch, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import ImageUploadModal from '../../components/complaint/ImageUploadModal';
import LocationPicker from '../../components/complaint/LocationPicker';

// Import the categories array
import categories from '../../data/complaintCategories';

// ComplaintForm component
const ComplaintForm = () => {
  const navigation = useNavigation();
  const [locationRemarks, setLocationRemarks] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [sendAnonymous, setSendAnonymous] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [images, setImages] = useState([null, null, null]);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Find the category title by id
  const { complaintid } = useLocalSearchParams();
  const category = categories.find(cat => cat.id === parseInt(complaintid));

  const handleSendAnonymousChange = () => {
    setSendAnonymous(!sendAnonymous);
  };

  const handleSubmit = () => {
    console.log('Form submitted with data:', {
      locationRemarks,
      complaintDescription,
      selectedDistrict,
      selectedCouncil,
      sendAnonymous,
      images,
      selectedLocation,
    });
    navigation.navigate('ComplaintDetails');
  };

  const handleLocationPress = () => {
    setShowMap(true);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowMap(false);
    setLocationRemarks(`Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}`);
  };

  const handleImageUpload = (index) => {
    setModalVisible(true);
  };

  const handleCameraSelect = async () => {
    setModalVisible(false);
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...images];
      newImages[images.findIndex(img => img === null)] = result.assets[0].uri;
      setImages(newImages);
    }
  };

  const handleGallerySelect = async () => {
    setModalVisible(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...images];
      newImages[images.findIndex(img => img === null)] = result.assets[0].uri;
      setImages(newImages);
    }
  };

  if (showMap) {
    return (
      <LocationPicker
        onLocationSelect={handleLocationSelect}
        onClose={() => setShowMap(false)}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* Add your back button icon here */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complaint</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Complaint Information</Text>
        {/* <ComplaintDetails /> */}
        <View style={styles.row}>
          <Text style={styles.label}>Complaint Category:</Text>
          <Text >{category ? category.title : 'Category not found'}</Text>
        </View>
        <Text style={styles.sectionTitle}>Complaint Proofs</Text>
        <View style={styles.imageUpload}>
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              style={styles.imageButton}
              onPress={() => handleImageUpload(index)}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.uploadedImage} />
              ) : (
                <Image source={require('../../assets/images/image.png')} style={styles.imageIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputWithIcon}
            placeholder="Select Address"
            value={selectedLocation ? `Lat: ${selectedLocation.latitude.toFixed(6)}, Lng: ${selectedLocation.longitude.toFixed(6)}` : ''}
            editable={false}
          />
          <TouchableOpacity onPress={handleLocationPress}>
            <Image source={require('../../assets/images/location.png')} style={styles.locationIcon} />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Location Remarks"
          // value={locationRemarks}
          // onChangeText={setLocationRemarks}
        />
        <TextInput
          style={styles.input}
          placeholder="Complaint Description"
          value={complaintDescription}
          onChangeText={setComplaintDescription}
          multiline={true}
          numberOfLines={4}
        />
        <View style={styles.checkboxContainer}>
          <Switch
            value={sendAnonymous}
            onValueChange={handleSendAnonymousChange}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={sendAnonymous ? '#f5dd4b' : '#f4f3f4'}
          />
          <Text style={styles.checkboxText}>Send the complaint anonymously</Text>
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
      <ImageUploadModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCameraSelect={handleCameraSelect}
        onGallerySelect={handleGallerySelect}
      />
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#B4B4B8',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#B4B4B8',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    marginTop: 10,
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    alignItems: 'center',
    marginLeft: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  imageUpload: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  imageButton: {
    width: 100,
    height: 100,
    backgroundColor: '#EEEDEB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#B4B4B8',
    borderWidth: 1,
    marginTop: 50,
    marginBottom: 50,
  },
  imageIcon: {
    width: 50,
    height: 50,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B4B4B8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  locationIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  inputWithIcon: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#B4B4B8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxText: {
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ComplaintForm;