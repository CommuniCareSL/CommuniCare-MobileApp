import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { useEffect, useState } from "react";
import { getUserDetails } from "../../hooks/storage";
import { useTranslation } from 'react-i18next';

import categories from '../../data/complaintCategories';

const Home = () => {
  const { t } = useTranslation(); // Access the translation function
  const incidents = {
    reported: 1452,
    inProgress: 693,
    resolved: 759,
  };

  //Name of the user
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    // Fetch user details on component mount
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getUserDetails();
        if (userDetails) {
          setFullName(userDetails.fullName); // Accessing 'fullName' from the decoded token
        } else {
          console.log("No user details found");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);


  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          {/* <Text style={styles.greeting}>Hello Chinthana!</Text> */}
          <Text style={styles.greeting}>{t('tabs.home.welcome')}{fullName ? `, ${fullName}` : ""}!</Text>
          <Text style={styles.subHeader}>{t('tabs.home.easily')}</Text>
          <View style={styles.incidentsContainer}>
            <View style={styles.incidentBox}>
              <Text style={styles.incidentNumber}>{incidents.reported}</Text>
              <Text style={styles.incidentText}>{t('tabs.home.report')}</Text>
            </View>
            <View style={styles.incidentBox}>
              <Text style={styles.incidentNumber}>{incidents.inProgress}</Text>
              <Text style={styles.incidentText}>{t('tabs.home.progress')}</Text>
            </View>
            <View style={styles.incidentBox}>
              <Text style={styles.incidentNumber}>{incidents.resolved}</Text>
              <Text style={styles.incidentText}>{t("tabs.home.Resolved")}</Text>
            </View>
          </View>
        </View>
        <View style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(`/complaintdetails/${encodeURIComponent(category.id)}`)}
              style={styles.categoryButton}
            >
              <View style={styles.categoryContent}>
                <Image source={category.icon} style={styles.categoryIcon} />
                <Text style={styles.categoryTitle} numberOfLines={2} ellipsizeMode="tail">
                {t(category.titleKey)}
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
