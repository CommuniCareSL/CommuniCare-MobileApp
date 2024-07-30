import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You may need to install this package

const SettingItem = ({ icon, title }) => (
  <TouchableOpacity style={styles.settingItem}>
    <Icon name={icon} size={24} color="#000" style={styles.icon} />
    <Text style={styles.settingText}>{title}</Text>
    <Icon name="chevron-right" size={24} color="#000" style={styles.chevron} />
  </TouchableOpacity>
);

const Settings = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>
      <View style={styles.settingsContainer}>
        <SettingItem icon="language" title="Language" />
        <SettingItem icon="person" title="Profile" />
        <SettingItem icon="description" title="Terms & Conditions" />
        <SettingItem icon="logout" title="Log Out" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginLeft:20,
    alignItems: 'left',
    marginVertical: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  settingsContainer: {
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    margin: 15,
    padding: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  icon: {
    marginRight: 15,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
  },
  chevron: {
    opacity: 0.5,
  },
});

export default Settings;