import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const LocationPicker = ({ onLocationSelect, onClose }) => {
  // State to manage the current location
  const [location, setLocation] = useState(null);
  // State to track any error messages
  const [errorMsg, setErrorMsg] = useState(null);
  // State to store the manually selected location on the map
  const [selectedLocation, setSelectedLocation] = useState(null);

  // On component mount, try to get the user's current location
  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get and set the current location
      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg('Could not retrieve current location');
      }
    })();
  }, []);

  // Handle map press to allow manual location selection
  const handleMapPress = (event) => {
    // Extract coordinates from the map press event
    const { latitude, longitude } = event.nativeEvent.coordinate;
    // Update the selected location state
    setSelectedLocation({
      latitude,
      longitude
    });
  };

  // Handle location selection (either current or manually selected)
  const handleSelectLocation = () => {
    // Prioritize manually selected location over current location
    const locationToSelect = selectedLocation || 
      (location ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      } : null);

    // Call the onLocationSelect prop with the chosen location
    if (locationToSelect) {
      onLocationSelect(locationToSelect);
    }
  };

  return (
    <View style={styles.container}>
      {location || selectedLocation ? (
        <MapView
          style={styles.map}
          // Use selected location or current location for initial region
          initialRegion={{
            latitude: (selectedLocation || location.coords).latitude,
            longitude: (selectedLocation || location.coords).longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          // Enable map press to select location
          onPress={handleMapPress}
        >
          {/* Show marker for current location */}
          {location && !selectedLocation && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              pinColor="blue" // Distinguish current location marker
              title="Current Location"
            />
          )}

          {/* Show marker for manually selected location */}
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              pinColor="red" // Distinguish selected location marker
              title="Selected Location"
            />
          )}
        </MapView>
      ) : (
        <Text>{errorMsg || 'Loading map...'}</Text>
      )}
      
      {/* Button container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSelectLocation}
          // Disable button if no location is selected
          disabled={!selectedLocation && !location}
        >
          <Text style={styles.buttonText}>
            {selectedLocation ? 'Confirm Selected Location' : 'Use Current Location'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={onClose}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LocationPicker;