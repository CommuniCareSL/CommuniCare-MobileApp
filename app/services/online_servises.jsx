import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ServiceCard = ({ title, description, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardContent}>
      <Image source={require('../../assets/images/service.png')} style={styles.cardIcon} />
      <View style={styles.cardTextContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#000" />
    </View>
  </TouchableOpacity>
);

const CategorySection = ({ title, services }) => (
  <View style={styles.categorySection}>
    <Text style={styles.categoryTitle}>{title}</Text>
    {services.map((service, index) => (
      <ServiceCard
        key={index}
        title={service.title}
        description={service.description}
        onPress={() => {}}
      />
    ))}
  </View>
);

const Services = () => {
  const router = useRouter();

  const reservationServices = [
    { title: "Booking the crematorium (8)", description: "Crematorium Booking" },
    { title: "Allotment of playgrounds (10)", description: "segregation of playgrounds" },
    { title: "Meeting hall reservation (19)", description: "Meeting Hall Reservation" },
  ];

  const rentalServices = [
    { title: "Concrete Mixer Rental (23)", description: "Concrete Mixer Rental" },
    { title: "Concrete Quality Test Mold Rental (24)", description: "Concrete Quality Testing Mold Rental" },
    { title: "Flagpole Rental (25)", description: "Flag Pole Rental" },
    { title: "Rollo Compressore Rental (26)", description: "Rental of Stone Rolls" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.header}>Online Services</Text>
  
        <CategorySection title="Reservations" services={reservationServices} />
        <CategorySection title="Rentals" services={rentalServices} />
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