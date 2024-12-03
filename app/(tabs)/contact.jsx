import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  ScrollView, 
  FlatList 
} from 'react-native';
import { useTranslation } from 'react-i18next';

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
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const ContactPage = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCouncil, setSelectedCouncil] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { t } = useTranslation();

  // Mock data - replace with your actual data
  const districts = ['District A', 'District B', 'District C'];
  const councils = {
    'District A': ['Council A1', 'Council A2'],
    'District B': ['Council B1', 'Council B2'],
    'District C': ['Council C1', 'Council C2'],
  };

  const contactInfo = {
    address: '123 Main St, City, Country',
    tel: '+1 234 567 8900',
    email: 'contact@example.com',
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('tabs.contact.contactus')}</Text>

      <Dropdown
        label="Select District"
        items={districts}
        selectedValue={selectedDistrict}
        onSelect={(item) => {
          setSelectedDistrict(item);
          setSelectedCouncil('');
        }}
      />

      <Dropdown
        label="Select Council"
        items={selectedDistrict ? councils[selectedDistrict] : []}
        selectedValue={selectedCouncil}
        onSelect={setSelectedCouncil}
      />

      <View style={styles.contactInfo}>
        <Text style={styles.infoText}>{t('tabs.contact.Address:')} {contactInfo.address}</Text>
        <Text style={styles.infoText}>{t('tabs.contact.Tel:')} {contactInfo.tel}</Text>
        <Text style={styles.infoText}>{t('tabs.contact.Email:')} {contactInfo.email}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsFormVisible(true)}
      >
        <Text style={styles.buttonText}>{t('tabs.contact.head')}</Text>
      </TouchableOpacity>

      <Modal
        visible={isFormVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('tabs.contact.form')}</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Subject"
              value={subject}
              onChangeText={setSubject}
            />
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Message"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                // Handle form submission here
                setIsFormVisible(false);
              }}
            >
              <Text style={styles.buttonText}>{t('tabs.contact.Submit')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsFormVisible(false)}
            >
              <Text style={styles.buttonText}>{t('tabs.contact.Cancel')}</Text>
            </TouchableOpacity>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
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
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    marginTop: 10,
  },
});

export default ContactPage;
