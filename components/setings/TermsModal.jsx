import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet } from 'react-native';

const TermsModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.termsModalContent}>
          <Text style={styles.modalTitle}>Terms & Conditions</Text>
          <ScrollView style={styles.termsScrollView}>
            <Text style={styles.termsText}>
              {/* Terms content */}
              1. Acceptance of Terms
              These terms and conditions govern your use of our mobile application. By accessing or using the app, you agree to be bound by these terms.

              2. User Responsibilities
              - You must provide accurate and current information
              - You are responsible for maintaining the confidentiality of your account
              - You agree to use the app for lawful purposes only

              3. Privacy
              We are committed to protecting your privacy. Please review our Privacy Policy for details on how we collect, use, and protect your personal information.

              4. Limitation of Liability
              Our app is provided "as is" without any warranties. We shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the app.

              5. Modifications
              We reserve the right to modify these terms at any time. Continued use of the app after changes constitutes acceptance of the new terms.
            </Text>
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
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
  termsModalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
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
  // Terms and Conditions Styles
  termsScrollView: {
    maxHeight: 400,
    width: '100%',
  },
  termsText: {
    fontSize: 14,
    lineHeight: 22,
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
});

export default TermsModal;
