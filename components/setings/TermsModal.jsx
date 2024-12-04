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
          <View style={styles.contentContainer}>
            <ScrollView style={styles.termsScrollView}>
              <Text style={[styles.termsText, { fontWeight: 'bold' }]}>
                1. Acceptance of Terms
              </Text>
              <Text style={styles.termsText}>
                By using this app, you agree to these Terms & our Privacy Policy. If you disagree, please stop using the app.
              </Text>

              <Text style={[styles.termsText, { fontWeight: 'bold' }]}>
                2. User Responsibilities
              </Text>
              <Text style={styles.termsText}>
                When using the app, you agree to:{"\n"}
                - Provide accurate and truthful information during registration or form submissions.{"\n"}
                - Use the app for lawful purposes only.{"\n"}
                - Avoid impersonating another individual or entity.{"\n"}
                - Keep your login credentials secure and confidential.
              </Text>

              <Text style={[styles.termsText, { fontWeight: 'bold' }]}>
                3. Privacy
              </Text>
              <Text style={styles.termsText}>
                Your data is used only to provide services and is kept secure. We don’t share it without your consent, except as required by law.
              </Text>

              <Text style={[styles.termsText, { fontWeight: 'bold' }]}>
                4. Limitation of Liability
              </Text>
              <Text style={styles.termsText}>
                - The app is provided "as is" without any warranties.{"\n"}
                - We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the app.
              </Text>

              <Text style={[styles.termsText, { fontWeight: 'bold' }]}>
                5. Modifications
              </Text>
              <Text style={styles.termsText}>
                - We reserve the right to modify these terms at any time.{"\n"}
                - Continued use of the app after changes implies acceptance of the new terms.
              </Text>
            </ScrollView>
          </View>
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
    marginBottom: 10,
    color: '#333',
  },
  // Content Container
  contentContainer: {
    flex: 1,
  },
  termsScrollView: {
    flex: 1,
    width: '100%',
  },
  termsText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginBottom: 10,
  },
  // Button Styles
  closeButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TermsModal;
