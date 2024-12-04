import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Button,
  ScrollView,
  FlatList 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import * as MailComposer from 'expo-mail-composer';
import { firstDropdownOptions, secondDropdownOptions } from '../../data/contactData';

const Dropdown = ({ label, items, selectedValue, onSelect }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setVisible(true)}>
        <Text style={styles.dropdownButtonText}>
          {selectedValue || label}
        </Text>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdownList}>
            <FlatList
              data={items}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text>{item.name || item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const ContactPage = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCouncil, setSelectedCouncil] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);  // To show modal for email
  const [emailBody, setEmailBody] = useState('');  // To store email body
  const { t } = useTranslation();

  const contactDetails = selectedCouncil
    ? secondDropdownOptions[selectedDistrict?.name]?.find(
        (council) => council.name === selectedCouncil.name
      )
    : null;

  // Send email function using expo-mail-composer
  const sendEmail = async () => {
    try {
      const result = await MailComposer.composeAsync({
        recipients: ['shensachin120@gmail.com'], // recipient email
        subject: 'Contact Us Inquiry', // email subject
        body: emailBody, // email body
      });

      if (result.status === 'sent') {
        console.log('Email sent successfully!');
        setIsModalVisible(false); // Close the modal after sending email
        setEmailBody(''); // Clear the email body
      } else {
        console.log('Email sending failed.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('tabs.contact.contactus')}</Text>

      {/* Dropdown for District */}
      <Dropdown
        label="Select District"
        items={firstDropdownOptions}
        selectedValue={selectedDistrict?.name || ''}
        onSelect={(item) => {
          setSelectedDistrict(item);
          setSelectedCouncil(null); // Reset council when district changes
        }}
      />

      {/* Dropdown for Council */}
      <Dropdown
        label="Select Council"
        items={selectedDistrict ? secondDropdownOptions[selectedDistrict.name] || [] : []}
        selectedValue={selectedCouncil?.name || ''}
        onSelect={setSelectedCouncil}
      />

      {/* Display Contact Info only after both District and Council are selected */}
      {selectedDistrict && selectedCouncil && contactDetails && (
        <View style={styles.contactInfo}>
          <Text style={styles.infoText}>
            {t('tabs.contact.Area:')} {selectedDistrict.name}
          </Text>
          <Text style={styles.infoText}>
            {t('tabs.contact.Tel:')} {contactDetails.phone}
          </Text>
          <Text style={styles.infoText}>
            {t('tabs.contact.Email:')} {contactDetails.email}
          </Text>
        </View>
      )}

      {/* Hide "Contact Us" button until district and council are selected */}
      {selectedDistrict && selectedCouncil && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsModalVisible(true)} // Show the modal when clicked
        >
          <Text style={styles.buttonText}>Contact Us</Text>
        </TouchableOpacity>
      )}

      {/* Modal for composing email */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Write your message</Text>
            <TextInput
              style={styles.messageInput}
              multiline
              numberOfLines={4}
              placeholder="Enter your message here"
              value={emailBody}
              onChangeText={setEmailBody}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.sendButton} onPress={sendEmail}>
                <Text style={styles.buttonText}>Send Email</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)} // Close modal on cancel
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdownButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 5,
    width: '80%',
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
});

export default ContactPage;
