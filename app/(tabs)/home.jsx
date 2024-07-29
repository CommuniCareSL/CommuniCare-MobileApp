import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Link, useRouter } from 'expo-router';

const Home = () => {
  const incidents = {
    reported: 1452,
    inProgress: 693,
    resolved: 759,
  };

  const categories = [
    {
      icon: require('../../assets/images/road.png'),
      title: 'Road hazards',
    },
    {
      icon: require('../../assets/images/forest.png'),
      title: 'Unsafe trees in roadside',
    },
    {
      icon: require('../../assets/images/garbage.png'),
      title: 'Garbage disposal on roadside',
    },
    {
      icon: require('../../assets/images/mosquito.png'),
      title: 'Mosquito breeding grounds',
    },
    {
      icon: require('../../assets/images/streetlight.png'),
      title: 'Street lamp malfunction',
    },
    {
      icon: require('../../assets/images/animal.png'),
      title: 'Stray animals',
    },
    {
      icon: require('../../assets/images/worker.png'),
      title: 'Unauthorized constructions',
    },
    {
      icon: require('../../assets/images/drain.png'),
      title: 'Damages to the street drains',
    },
    
    {
      icon: require('../../assets/images/toilet.png'),
      title: 'Issues related to public toilets',
    },
    {
      icon: require('../../assets/images/seller.png'),
      title: 'Unauthorized street sellers',
    },
  ];

  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello Chinthana!</Text>
          <Text style={styles.subHeader}>Easily Connect with Your Local Government Office</Text>
          <View style={styles.incidentsContainer}>
            <View style={styles.incidentBox}>
              <Text style={styles.incidentNumber}>{incidents.reported}</Text>
              <Text style={styles.incidentText}>Reported</Text>
            </View>
            <View style={styles.incidentBox}>
              <Text style={styles.incidentNumber}>{incidents.inProgress}</Text>
              <Text style={styles.incidentText}>In Progress</Text>
            </View>
            <View style={styles.incidentBox}>
              <Text style={styles.incidentNumber}>{incidents.resolved}</Text>
              <Text style={styles.incidentText}>Resolved</Text>
            </View>
          </View>
        </View>
        <View style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(`/complaint?category=${encodeURIComponent(category.title)}`)}
              style={styles.categoryButton}
            >
              <View style={styles.categoryContent}>
                <Image source={category.icon} style={styles.categoryIcon} />
                <Text style={styles.categoryTitle} numberOfLines={2} ellipsizeMode="tail">
                  {category.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop:20,
    padding: 20,
    backgroundColor: '#007bff',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  greeting: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 5,
  },
  subHeader: {
    marginTop:20,
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  incidentsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  incidentBox: {
    alignItems: 'center',
  },
  incidentNumber: {
    fontSize: 24,
    color: '#fff',
  },
  incidentText: {
    fontSize: 14,
    color: '#fff',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  categoryButton: {
    width: '48%',
    height: 120, 
    borderRadius: 10,
    backgroundColor: '#EEEDEB',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  categoryContent: {
    width: '100%',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  categoryTitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

export default Home;
