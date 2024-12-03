import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ServiceDetailsModal = ({ 
  isVisible, 
  onClose, 
  service,
  onAppointment 
}) => {
  if (!service) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header with Close Button */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Service Title */}
          <Text style={styles.modalTitle}>{service.title}</Text>
          
          {/* Service Details */}
          <ScrollView style={styles.detailsContainer}>
            <Text style={styles.detailsDescription}>{service.description}</Text>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Processing Time</Text>
              <Text style={styles.detailText}>{service.details.processingTime}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Required Documents</Text>
              {service.details.requiredDocuments.map((doc, index) => (
                <Text key={index} style={styles.listItem}>• {doc}</Text>
              ))}
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Fees</Text>
              <Text style={styles.detailText}>{service.details.fees}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Additional Information</Text>
              <Text style={styles.detailText}>{service.details.additionalInfo}</Text>
            </View>
          </ScrollView>

          {/* Appointment Button */}
          <TouchableOpacity 
            style={styles.appointmentButton} 
            onPress={() => onAppointment(service)}
          >
            <Text style={styles.appointmentButtonText}>Make an Appointment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row-reverse',
    marginBottom: 15,
  },
  closeButton: {
    padding: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailsContainer: {
    maxHeight: 400,
  },
  detailsDescription: {
    fontSize: 16,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  detailSection: {
    marginBottom: 15,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
  },
  listItem: {
    fontSize: 16,
    marginLeft: 10,
  },
  appointmentButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  appointmentButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ServiceDetailsModal;