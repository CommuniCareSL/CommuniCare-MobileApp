import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Records = () => {
  const [complaintsInProgress, setComplaintsInProgress] = React.useState(10);
  const [complaintsComplete, setComplaintsComplete] = React.useState(5);
  const [servicesInProgress, setServicesInProgress] = React.useState(8);
  const [servicesComplete, setServicesComplete] = React.useState(3);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo at the top right */}
        <Image
          source={require('../../assets/images/logo.jpg')} // Replace with your actual logo path
          style={styles.logo}
        />
        
        <View style={[styles.section, styles.complaintSection]}>
          <Text style={styles.title}>Complaint</Text>
          <View style={styles.cardsContainer}>
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>Complaints In Progress</Text>
                  <Text style={styles.cardDescription}>View number of complaints currently in progress</Text>
                </View>
                <Text style={styles.count}>{complaintsInProgress}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>Complete Complaints</Text>
                  <Text style={styles.cardDescription}>Overview of all services that have been successfully completed</Text>
                </View>
                <Text style={styles.count}>{complaintsComplete}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, styles.servicesSection]}>
          <Text style={styles.title}>Services</Text>
          <View style={styles.cardsContainer}>
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>Services In Progress</Text>
                  <Text style={styles.cardDescription}>View number of services currently in progress</Text>
                </View>
                <Text style={styles.count}>{servicesInProgress}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>Complete Services</Text>
                  <Text style={styles.cardDescription}>Lists all successfully completed services</Text>
                </View>
                <Text style={styles.count}>{servicesComplete}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingTop: 20, // Adjust if needed
    position: 'relative',
  },
  logo: {
    position: 'relative',
    top: -50, // Adjust this value to move the logo up
    right: -270,
    width: 100,
    height: 100,
  },
  section: {
    marginBottom: -5, // Adjust margin between sections
  },
  complaintSection: {
    marginTop: -50, // Ensure no extra margin at the top
  },
  servicesSection: {
    marginTop: 16, // Adjust margin if needed
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1E40AF',
  },
  cardsContainer: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
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
  count: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  linksContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  link: {
    marginBottom: 16,
  },
  linkText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Records;
