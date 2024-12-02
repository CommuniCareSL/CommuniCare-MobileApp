import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CardImage = ({ type }) => {
  switch (type) {
    case 'reservation':
      return <Image source={require('../../assets/images/service.png')} style={styles.cardIcon} />;
    // case 'rental':
    //   return <Image source={require('../../assets/images/rent.png')} style={styles.cardIcon} />;
    default:
      return <Image source={require('../../assets/images/service.png')} style={styles.cardIcon} />;
  }
};

const ServiceCard = ({ title, description, onPress, type }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardContent}>
      <CardImage type={type} />
      <View style={styles.cardTextContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#000" />
    </View>
  </TouchableOpacity>
);

const CategorySection = ({ title, services, type }) => (
  <View style={styles.categorySection}>
    <Text style={styles.categoryTitle}>{title}</Text>
    {services.map((service, index) => (
      <ServiceCard
        key={index}
        title={service.title}
        description={service.description}
        onPress={service.onPress}
        type={type}
      />
    ))}
  </View>
);

const Services = () => {
  const router = useRouter();

  const reservationServices = [
    { title: "Booking the crematorium (8)", description: "Crematorium Booking", onPress: () => router.push('services/reservations/crematorium') },
    { title: "Segregation of playgrounds (10)", description: "Segregation of playgrounds",  onPress: () => router.push('services/reservations/[playground]') },
    { title: "Allotment of satipola land (19)", description: "Allotment of satipola land", onPress: () => router.push('services/reservations/sathipola') },
    { title: "Allotment of parking in front of City Hall (19)", description: "Allotment of parking in front of City Hall", onPress: () => router.push('services/reservations/parkinglot') },
    { title: "Allotment of community hall (19)", description: "Allotment of community hall", onPress: () => router.push('services/reservations/communityhall') },
    { title: "Avail Gali Bowsara service (19)", description: "Avail Gali Bowsara service", onPress: () => router.push('services/reservations/gully') },
    { title: "Display of advertisements(19)", description: "Display of advertisements", onPress: () => router.push('services/reservations/billboard') },
  ];

  // const rentalServices = [
  //   { title: "Concrete Mixer Rental (23)", description: "Concrete Mixer Rental", onPress: () => {/* handle navigation */} },
  //   { title: "rent the excavator (23)", description: "rent the excavator", onPress: () => {/* handle navigation */} },
  //   { title: "Concrete Quality Test Mold Rental (24)", description: "Concrete Quality Testing Mold Rental", onPress: () => {/* handle navigation */} },
  //   { title: "Flagpole Rental (25)", description: "Flag Pole Rental", onPress: () => {/* handle navigation */} },
  //   { title: "Rollo Compressore Rental (26)", description: "Rental of Stone Rolls", onPress: () => {/* handle navigation */} },
  // ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.header}>Online Services</Text>
  
        <CategorySection title="Reservations" services={reservationServices} type="reservation" />
        {/* <CategorySection title="Rentals" services={rentalServices} type="rental" /> */}
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