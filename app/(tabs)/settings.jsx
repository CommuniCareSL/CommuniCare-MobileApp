import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import LanguageSelectionModal from '../../components/setings/LanguageSelectionModal';
import ProfileEditModal from '../../components/setings/ProfileEditModal';
import TermsModal from '../../components/setings/TermsModal';
import LogoutModal from '../../components/setings/LogoutModal';

const Settings = () => {
  const { t } = useTranslation();
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isTermsModalVisible, setTermsModalVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  // Updated profile with additional fields
  const [profile, setProfile] = useState({
    fullName: 'Johnathan Doe',
    name: 'John Doe',
    email: 'johndoe@example.com',
    phoneNumber: '+1234567890',
    district: 'Colombo',
    pradeshiyaSabha: 'Colombo City Sabha',
  });

  const handleSaveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const handleLogout = () => {
    console.log('User logged out');
    setLogoutModalVisible(false);
  };

  const SettingItem = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <Icon name={icon} size={24} color="#000" style={styles.icon} />
      <Text style={styles.settingText}>{title}</Text>
      <Icon name="chevron-right" size={24} color="#000" style={styles.chevron} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LanguageSelectionModal
        visible={isLanguageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
      />
      <ProfileEditModal
        visible={isProfileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />
      <TermsModal
        visible={isTermsModalVisible}
        onClose={() => setTermsModalVisible(false)}
      />
      <LogoutModal
        visible={isLogoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirmLogout={handleLogout}
      />

      <SettingItem
        icon="language"
        title={t('tabs.settings.Language')}
        onPress={() => setLanguageModalVisible(true)}
      />
      <SettingItem
        icon="person"
        title={t('tabs.settings.Profile')}
        onPress={() => setProfileModalVisible(true)}
      />
      <SettingItem
        icon="info"
        title="Terms & Conditions"
        onPress={() => setTermsModalVisible(true)}
      />
      <SettingItem
        icon="logout"
        title="Logout"
        onPress={() => setLogoutModalVisible(true)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  icon: {
    marginRight: 15,
    color: '#007bff',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  chevron: {
    opacity: 0.5,
    color: '#999',
  },
});

export default Settings;
