import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const LogoutModal = ({ visible, onClose, onConfirmLogout }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Logout</Text>
          <Text style={styles.logoutText}>Are you sure you want to log out?</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutConfirmButton} onPress={onConfirmLogout}>
              <Text style={styles.logoutConfirmButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Modal Styles
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
    // Button Styles
    closeButton: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#007bff',
      borderRadius: 5,
      width: '100%',
      alignItems: 'center',
    },
    closeButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
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
    logoutConfirmButton: {
      flex: 1,
      marginLeft: 10,
      padding: 10,
      backgroundColor: '#dc3545',
      borderRadius: 5,
      alignItems: 'center',
    },
    logoutConfirmButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    logoutText: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
      color: '#333',
    }
});

export default LogoutModal;
