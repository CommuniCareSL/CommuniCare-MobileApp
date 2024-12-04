import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const ProfileEditModal = ({ visible, onClose, profile, onSaveProfile }) => {
  const [editedProfile, setEditedProfile] = useState(profile);

  // Update editedProfile when profile prop changes
  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  const handleSave = () => {
    onSaveProfile(editedProfile);
    onClose();
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
          
          {/* Full Name Input */}
          <TextInput
            style={styles.profileInput}
            placeholder="Full Name"
            value={editedProfile.fullName}
            onChangeText={(text) => setEditedProfile({ ...editedProfile, fullName: text })}
          />
          
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

          {/* District Input */}
          <TextInput
            style={styles.profileInput}
            placeholder="District"
            value={editedProfile.district}
            onChangeText={(text) => setEditedProfile({ ...editedProfile, district: text })}
          />

          {/* Pradeshiya Sabha Input */}
          <TextInput
            style={styles.profileInput}
            placeholder="Pradeshiya Sabha"
            value={editedProfile.pradeshiyaSabha}
            onChangeText={(text) => setEditedProfile({ ...editedProfile, pradeshiyaSabha: text })}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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

