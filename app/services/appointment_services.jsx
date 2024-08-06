import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CardImage = ({ type }) => {
  switch (type) {
    
    default:
      return <Image source={require('../../assets/images/appointment.png')} style={styles.cardIcon} />;
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
    { title: "Approval of building plans", description: "ගොඩනැගිලි සැලසුම් අනුමත කිරීම ", onPress: () => router.push('/services/crematorium') },
    { title: "Approving land subdivision and amalgamation development plans", description: "ඉඩම් අනු බෙදුම් හා ඒකාබද්ද කිරීමේ සංවර්ධන සැලසුම් අනුමත කිරීම", onPress: () => {/* handle navigation */} },
    { title: "Issuance of Certificate of Conformity", description: "අනුකුඋලතා සහතිකයක් නිකුත් කිරීම ", onPress: () => {/* handle navigation */} },
    { title: "Obtaining a trade license", description: "වෙළද බලපත්‍රයක් ලබාගැනීම ", onPress: () => router.push('/services/crematorium') },
    { title: "Obtaining an Environmental Compliance Certificate", description: "පරිසර අනුකුඋලතා සහතිකයක් ලබාගැනීම", onPress: () => {/* handle navigation */} },
    { title: "Obtaining an Environmental Compliance Certificate", description: "පරිසර අනුකුඋලතා සහතිකයක් ලබාගැනීම", onPress: () => {/* handle navigation */} },
  ];

  const rentalServices = [
    { title: "Concrete Mixer Rental (23)", description: "Concrete Mixer Rental", onPress: () => {/* handle navigation */} },
    { title: "Concrete Quality Test Mold Rental (24)", description: "Concrete Quality Testing Mold Rental", onPress: () => {/* handle navigation */} },
    { title: "Flagpole Rental (25)", description: "Flag Pole Rental", onPress: () => {/* handle navigation */} },
    { title: "Rollo Compressore Rental (26)", description: "Rental of Stone Rolls", onPress: () => {/* handle navigation */} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.header}>Appointment Services</Text>
  
        <CategorySection title="Appointment services" services={reservationServices} type="appointments" />
        
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