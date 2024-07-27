import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Link } from 'expo-router';

const Home = () => {
  const categories = [
    {
      icon: require('../../assets/images/forest.png'),
      title: 'Unsafe Tree in the roadside',
    },
    {
      icon: require('../../assets/images/animal.png'),
      title: 'Stray Animal',
    },
    {
      icon: require('../../assets/images/garbage.png'),
      title: 'Garbage Disposal on roadside',
    },
    {
      icon: require('../../assets/images/streetlight.png'),
      title: 'Streetlamp Malfunction',
    },
    {
      icon: require('../../assets/images/worker.png'),
      title: 'Unauthorized constructions',
    },
    {
      icon: require('../../assets/images/drain.png'),
      title: 'Damages on drains',
    },
    {
      icon: require('../../assets/images/mosquito.png'),
      title: 'Mosquito breeding grounds',
    },
    {
      icon: require('../../assets/images/road.png'),
      title: 'Road Hazards',
    },
    {
      icon: require('../../assets/images/seller.png'),
      title: 'Unauthorized street sellers',
    },
    {
      icon: require('../../assets/images/drain.png'),
      title: 'Damages on drains',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Communi Care</Text>
        <Image source={require('../../assets/images/logo.jpg')} style={styles.phoneIcon} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/complaint?category=${encodeURIComponent(category.title)}`}
              style={styles.categoryButton}
            >
              <Image source={category.icon} style={styles.categoryIcon} />
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </Link>
          ))}
        </View>
      </ScrollView>
      {/* Uncomment this section if you need a footer */}
      {/* <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Image source={require('../../assets/images/react-logo.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Image source={require('../../assets/images/react-logo.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Image source={require('../../assets/images/react-logo.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Image source={require('../../assets/images/react-logo.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Image source={require('../../assets/images/react-logo.png')} style={styles.footerIcon} />
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  phoneIcon: {
    width: 24,
    height: 24,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '48%',
    height: 140, // Increased height for better spacing
    padding: 10, // Reduced padding
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
  },
  categoryIcon: {
    width: 40, // Increased icon size
    height: 40, // Increased icon size
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 14, 
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center', 
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  footerButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#fff',
    elevation: 2,
  },
  footerIcon: {
    width: 24,
    height: 24,
  },
});

export default Home;
