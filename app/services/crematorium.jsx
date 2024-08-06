import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Screen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>crematorial Reservation</Text>
        <View style={styles.headerRight}>
          <Text style={styles.time}></Text>
          <Image
            source={require('../../assets/images/service.png')}
            style={styles.icon}
          />
          <Image
            source={require('../../assets/images/service.png')}
            style={styles.icon}
          />
        </View>
      </View>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/service.png')}
          style={styles.profileImage}
        />
        <View style={styles.jobDetails}>
          <Text style={styles.jobTitle}>Reserve crematorial</Text>
          <View style={styles.location}>
            <Image
              source={require('../../assets/images/service.png')}
              style={styles.locationIcon}
            />
            <Text style={styles.locationText}></Text>
          </View>
          <Text style={styles.jobType}></Text>
          <Text style={styles.salary}>Rs:8500 per </Text>
        </View>
      </View>
      <View style={styles.jobDescription}>
        <Text style={styles.sectionTitle}>Details:</Text>
        <Text style={styles.descriptionText}>

        01. අයදුම්පත්‍රයක් ලබගෙන් කොරනේලිස් විසින් අත්සන් කරන ලද මරණ සහතිකයේ මුල් පිටපතෙහි පිටපතක්.
      
    
        </Text>
        <Text style={styles.descriptionText}>

        02. මරණ සහතිකයේ නාකියාදෙනිය අදහනගරයෙහි ආදාහනය කිරීමට අවසර ලබාදෙමි ලෙස සදහන් විය යුතුය.
        </Text>
        <Text style={styles.descriptionText}>

        
03.අදහනාගාරය වෙන් කිරීමේ ගාස්තුව බල ප්‍රදේශය තුල නම් 10000/= බල ප්‍රදේශයෙන් පිටත නම් 13000/=. 
    
        </Text>
        <Text style={styles.sectionTitle}>Requirements:</Text>
        <Text style={styles.descriptionText}>
        මරණ සහතිකයේ පිටපතක්.
        </Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Proceed to payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Changed background to white
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', // Changed text to black
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 16,
    color: '#000', // Changed text to black
    marginRight: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  content: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 20,
  },
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', // Changed text to black
    marginBottom: 5,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationIcon: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  locationText: {
    color: '#000', // Changed text to black
  },
  jobType: {
    color: '#000', // Changed text to black
    marginBottom: 10,
  },
  salary: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // Changed text to black
  },
  jobDescription: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // Changed text to black
    marginBottom: 10,
  },
  descriptionText: {
    color: '#000', // Changed text to black
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#ffc107',
    padding: 15,
    margin: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000', // Changed text to black
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Screen;