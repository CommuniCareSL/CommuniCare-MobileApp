import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const StatusScreen = ({ navigation }) => {
  // Dummy data for demonstration
  const serviceDetails = {
    name: 'Water Supply Service',
    address: '123 Main Street, Colombo',
    idNumber: 'WS-987654',
    declaration: 'This service provides continuous water supply to registered users.',
  };

  const handleProceedToPayment = () => {
    // Navigate to a dummy Payment screen for now
    navigation.navigate('Payment', { serviceDetails });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Service Details</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Name:</Text>
        <Text style={styles.detailValue}>{serviceDetails.name}</Text>

        <Text style={styles.detailLabel}>Address:</Text>
        <Text style={styles.detailValue}>{serviceDetails.address}</Text>

        <Text style={styles.detailLabel}>ID Number:</Text>
        <Text style={styles.detailValue}>{serviceDetails.idNumber}</Text>

        <Text style={styles.detailLabel}>Declaration:</Text>
        <Text style={styles.detailValue}>{serviceDetails.declaration}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleProceedToPayment}>
        <Text style={styles.buttonText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  detailContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StatusScreen;
