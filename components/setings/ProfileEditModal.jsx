import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { firstDropdownOptions, secondDropdownOptions } from '../../data/districtSabha'; // Adjust the import path

const ProfileEditModal = ({ visible, onClose, profile, onSaveProfile }) => {
  const [editedProfile, setEditedProfile] = useState(profile);
  const [selectedDistrict, setSelectedDistrict] = useState(profile.district || 'Select');
  const [pradeshiyaSabhaOptions, setPradeshiyaSabhaOptions] = useState(
    secondDropdownOptions[profile.district] || []
  );

  useEffect(() => {
    setEditedProfile(profile);
    setSelectedDistrict(profile.district || 'Select');
    setPradeshiyaSabhaOptions(secondDropdownOptions[profile.district] || []);
  }, [profile]);

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    setPradeshiyaSabhaOptions(secondDropdownOptions[district] || []);
    setEditedProfile({ ...editedProfile, district: district, pradeshiyaSabha: '' });
  };

  const handleSave = () => {
    onSaveProfile(editedProfile);
    onClose();
  };

  // Helper function to display password as asterisks
  const getPasswordDisplay = () => {
    return editedProfile.password ? '*'.repeat(editedProfile.password.length) : '';
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Profile</Text>

          {/* Name Input */}
          <TextInput
            style={styles.profileInput}
            placeholder="Name"
            value={editedProfile.name}
            onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
          />

          {/* Email Input */}
          <TextInput
            style={styles.profileInput}
            placeholder="Email"
            value={editedProfile.email}
            onChangeText={(text) => setEditedProfile({ ...editedProfile, email: text })}
            keyboardType="email-address"
          />

          {/* Phone Number Input */}
          <TextInput
            style={styles.profileInput}
            placeholder="Phone Number"
            value={editedProfile.phoneNumber}
            onChangeText={(text) => setEditedProfile({ ...editedProfile, phoneNumber: text })}
            keyboardType="phone-pad"
          />

          {/* District Dropdown */}
          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>District</Text>
            <Picker
              selectedValue={selectedDistrict}
              onValueChange={handleDistrictChange}
            >
              {firstDropdownOptions.map((option) => (
                <Picker.Item key={option.districtid} label={option.name} value={option.name} />
              ))}
            </Picker>
          </View>

          {/* Pradeshiya Sabha Dropdown */}
          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>Pradeshiya Sabha</Text>
            <Picker
              selectedValue={editedProfile.pradeshiyaSabha}
              onValueChange={(value) =>
                setEditedProfile({ ...editedProfile, pradeshiyaSabha: value })
              }
            >
              {pradeshiyaSabhaOptions.map((option) => (
                <Picker.Item key={option.id} label={option.name} value={option.name} />
              ))}
            </Picker>
          </View>

          {/* Password Input - Displaying as asterisks */}
          <TextInput
            style={styles.profileInput}
            placeholder="Password"
            value={getPasswordDisplay()}  // Display asterisks
            onChangeText={(text) => setEditedProfile({ ...editedProfile, password: text })}
            secureTextEntry
          />

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  profileInput: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileEditModal;
