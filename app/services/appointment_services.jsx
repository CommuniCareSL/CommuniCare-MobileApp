import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Import the services data and modal
import { reservationServices } from '../../data/serviceData';
import ServiceDetailsModal from '../../components/services/ServiceDetailsModal';

const CardImage = ({ type }) => {
  switch (type) {
    default:
      return <Image source={require('../../assets/images/appointment.png')} style={styles.cardIcon} />;
  }
};

const ServiceCard = ({ service, onPress, type }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(service)}>
    <View style={styles.cardContent}>
      <CardImage type={type} />
      <View style={styles.cardTextContent}>
        <Text style={styles.cardTitle}>{service.title}</Text>
        <Text style={styles.cardDescription}>{service.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#000" />
    </View>
  </TouchableOpacity>
);

const CategorySection = ({ title, services, type, onServicePress }) => (
  <View style={styles.categorySection}>
    <Text style={styles.categoryTitle}>{title}</Text>
    {services.map((service, index) => (
      <ServiceCard
        key={service.id || index}
        service={service}
        onPress={onServicePress}
        type={type}
      />
    ))}
  </View>
);

const Services = () => {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceDetails = (service) => {
    setSelectedService(service);
  };

  const handleAppointment = (service) => {
    // Close the modal first
    setSelectedService(null);
    
    // Navigate to appointment booking screen with service details
    router.push({
      pathname: './AppointmentBookingPage',
      params: { serviceId: service.id, serviceTitle: service.title }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.header}>Appointment Services</Text>
  
        <CategorySection 
          title="Service Categories" 
          services={reservationServices} 
          type="appointments" 
          onServicePress={handleServiceDetails}
        />
        
        {/* Service Details Modal */}
        <ServiceDetailsModal
          isVisible={!!selectedService}
          onClose={() => setSelectedService(null)}
          service={selectedService}
          onAppointment={handleAppointment}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  card: {
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  cardTextContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default Services;