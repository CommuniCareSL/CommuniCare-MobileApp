import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo

const ServiceCard = ({ title, description, icon }) => (
  <TouchableOpacity style={styles.card}>
    <View style={styles.cardContent}>
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
        <Text style={styles.moreInfo}>More info</Text>
      </View>
      <Ionicons name={icon} size={40} color="#4A90E2" />
    </View>
  </TouchableOpacity>
);

const Services = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/logo.jpg')} // Replace with your actual logo path
          style={styles.logo}
        />
        <Text style={styles.logoText}>COMMUNI CARE</Text>
        
        <ServiceCard 
          title="Online Services" 
          description="Easily access our services online from home."
          icon="people-circle-outline"
        />
        
        <ServiceCard 
          title="Appointment Services" 
          description="Book an appointment for services that need an in-person visit."
          icon="calendar-outline"
        />
      </View>
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
  logo: {
    width: 400,
    height: 400,
    alignSelf: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  moreInfo: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});

export default Services;
