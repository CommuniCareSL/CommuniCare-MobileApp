import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Switch, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';

// ComplaintDetails component to display the complaint ID
const ComplaintDetails = () => {
  const { complaintid } = useLocalSearchParams();

  return (
    <View style={styles.row}>
      <Text style={styles.label}>Complaint Category:</Text>
      <Text>{complaintid}</Text>
    </View>
  );
};

// ComplaintForm component
const ComplaintForm = () => {
  const navigation = useNavigation();
  const [locationRemarks, setLocationRemarks] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCouncil, setSelectedCouncil] = useState('');
  const [sharePhoneNumber, setSharePhoneNumber] = useState(false);
  const [region, setRegion] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleSharePhoneNumberChange = () => {
    setSharePhoneNumber(!sharePhoneNumber);
  };

  const handleSubmit = () => {
    console.log('Form submitted with data:', {
      locationRemarks,
      complaintDescription,
      selectedDistrict,
      selectedCouncil,
      sharePhoneNumber,
    });
    navigation.navigate('ComplaintDetails'); // Navigate to details screen
  };

  const handleLocationPress = () => {
    navigation.navigate('MapScreen', { region }); // Pass the current region to the MapScreen
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complaint</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Complaint Information</Text>
        <ComplaintDetails />
        <Text style={{ fontSize: 16, marginLeft: 10, fontWeight: 'bold', }}>Complaint Proofs</Text>
        <View style={styles.imageUpload}>
          <TouchableOpacity style={styles.imageButton}>
            <Image source={require('../../assets/images/image.png')} style={styles.imageIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton}>
            <Image source={require('../../assets/images/image.png')} style={styles.imageIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton}>
            <Image source={require('../../assets/images/image.png')} style={styles.imageIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputWithIcon}
            placeholder="Select Address"
            editable={false}
            onPress={handleLocationPress} // Open map on press
          />
          <TouchableOpacity onPress={handleLocationPress}>
            <Image source={require('../../assets/images/location.png')} style={styles.locationIcon} />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Location Remarks"
          value={locationRemarks}
          onChangeText={setLocationRemarks}
        />
        <TextInput
          style={styles.input}
          placeholder="Complaint Description"
          value={complaintDescription}
          onChangeText={setComplaintDescription}
        />
        <Text style={styles.sectionTitle}>Complaint Receiver</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedDistrict(value)}
          items={[
            { label: 'Colombo', value: 'District 1' },
            { label: 'Galle', value: 'District 2' },
            { label: 'Mathara', value: 'District 3' },
            { label: 'Kaluthara', value: 'District 4' },
            { label: 'Gampaha', value: 'District 5' },
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select District', value: null }}
        />
        <RNPickerSelect
          onValueChange={(value) => setSelectedCouncil(value)}
          items={[
            { label: 'Colombo Municipal Council', value: 'Council 1' },
            { label: 'Dehiwala - Mt. Lavinia Municipal Council', value: 'Council 2' },
            { label: 'Sri Jayawardenepura Kotte Municipal Council', value: 'Council 3' },
            { label: 'Kaduwela Municipal Council', value: 'Council 4' },
            { label: 'Moratuwa Municipal Council', value: 'Council 5 ' },
            { label: 'Kollonnawa Urban Council', value: 'Council 6' },
            { label: 'Kollonnawa Urban Council', value: 'Council 7' },
            { label: 'Kollonnawa Urban Council', value: 'Council 8' },
            { label: 'Kollonnawa Urban Council', value: 'Council 9' },
            { label: 'Kollonnawa Urban Council', value: 'Council 10' },
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select Council', value: null }}
        />
        <View style={styles.checkboxContainer}>
          <Switch
            value={sharePhoneNumber}
            onValueChange={handleSharePhoneNumberChange}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={sharePhoneNumber ? '#f5dd4b' : '#f4f3f4'}
          />
          <Text style={styles.checkboxText}>Share phone number with council</Text>
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// MapScreen component to display a map with a marker
const MapScreen = ({ route }) => {
  const { region } = route.params;
  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
      >
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
      </MapView>
    </View>
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
  backArrow: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    marginTop: 10,
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    alignItems: 'center',
    marginLeft: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    marginLeft: 10,
    marginTop: 10,
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
    fontSize: 16,
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
    marginTop: 25,
    marginLeft: 10,
    marginBottom: 50,
  },
  imageIcon: {
    width: 50,
    height: 50,
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
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default ComplaintForm;





