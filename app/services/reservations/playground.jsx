import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SecureStore from 'expo-secure-store';
import { submitReservation } from '../../../services/reservationService';
import { fetchGroundsBySabhaId } from '../../../services/reservations/groundService'; // Import the service
import RNPickerSelect from 'react-native-picker-select'; // For dropdown

// Validation schema for the form
const validationSchema = Yup.object().shape({
  event: Yup.string().required('Event is required'),
  description: Yup.string().required('Description is required'),
  date: Yup.string().required('Date is required'),
  groundId: Yup.string().required('Ground selection is required'),
  agree: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
});

const PlaygroundReservation = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userId, setUserId] = useState(null);
  const [sabhaId, setSabhaId] = useState(null);
  const [grounds, setGrounds] = useState([]); // List of grounds
  const [selectedGround, setSelectedGround] = useState(null); // Selected ground details

  // Fetch user details (userId and sabhaId) from secure storage
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedUserDetails = await SecureStore.getItemAsync('userDetails');
        if (storedUserDetails) {
          const { userId, sabhaId } = JSON.parse(storedUserDetails);
          setUserId(userId);
          setSabhaId(sabhaId);

          // Fetch grounds using sabhaId
          const groundsData = await fetchGroundsBySabhaId(sabhaId);
          setGrounds(groundsData);
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Playground Reservation</Text>

        <Formik
          initialValues={{
            event: '',
            description: '',
            date: '',
            groundId: '',
            agree: false,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            // Prepare payload for backend
            const payload = {
              ...values,
              userId, // Include userId from state
              sabhaId, // Include sabhaId from state
              reservationId: 1, // Static value for playground reservation
              date: selectedDate.toISOString().split('T')[0], // Format date
            };

            // Log the payload to the console
            console.log('Data sent to backend:', payload);

            try {
              // Submit reservation to backend
              await submitReservation(payload);
              alert('Reservation submitted successfully');
              resetForm();
            } catch (error) {
              console.error('Reservation submission failed:', error);
              alert('Failed to submit reservation');
            }
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.form}>
              {/* Event Input */}
              <TextInput
                style={styles.input}
                placeholder="What is Held (Event)"
                onChangeText={handleChange('event')}
                onBlur={handleBlur('event')}
                value={values.event}
              />
              {touched.event && errors.event && <Text style={styles.error}>{errors.event}</Text>}

              {/* Description Input */}
              <TextInput
                style={styles.input}
                placeholder="Description"
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
              />
              {touched.description && errors.description && <Text style={styles.error}>{errors.description}</Text>}

              {/* Ground Selection Dropdown */}
              <View style={styles.dropdownContainer}>
                <RNPickerSelect
                  placeholder={{ label: 'Select Ground', value: null }}
                  items={grounds.map((ground) => ({
                    label: ground.name,
                    value: ground.groundId,
                  }))}
                  onValueChange={(value) => {
                    setFieldValue('groundId', value);
                    const selected = grounds.find((ground) => ground.groundId === value);
                    setSelectedGround(selected);
                  }}
                  value={values.groundId}
                />
              </View>
              {touched.groundId && errors.groundId && <Text style={styles.error}>{errors.groundId}</Text>}

              {/* Display Area and Terms */}
              {selectedGround && (
                <>
                  <Text style={styles.label}>Area: {selectedGround.area}</Text>
                  <Text style={styles.label}>Terms: {selectedGround.terms}</Text>
                </>
              )}

              {/* Date Picker */}
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.datePickerText}>
                  {selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    handleDateChange(event, selectedDate);
                    setFieldValue('date', selectedDate.toISOString().split('T')[0]);
                  }}
                />
              )}
              {touched.date && errors.date && <Text style={styles.error}>{errors.date}</Text>}

              {/* Declaration Box */}
              <View style={styles.declarationBox}>
                <Text style={styles.declaration}>
                  By reserving this playground, I agree to the terms and conditions:
                  {'\n'}- No damage to property.{'\n'}- Follow all rules and regulations.
                </Text>
              </View>

              {/* Agreement Checkbox */}
              <TouchableOpacity
                style={styles.radioContainer}
                onPress={() => setFieldValue('agree', !values.agree)}
              >
                <View style={styles.radioButton}>
                  {values.agree && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.radioText}>I Agree</Text>
              </TouchableOpacity>
              {touched.agree && errors.agree && <Text style={styles.error}>{errors.agree}</Text>}

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, !values.agree && { backgroundColor: '#ccc' }]}
                onPress={handleSubmit}
                disabled={!values.agree}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#F0F8FF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#F0F8FF',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  datePickerButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 16,
    color: '#555',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#28a745',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#28a745',
  },
  radioText: {
    fontSize: 16,
    color: '#555',
  },
  declarationBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    backgroundColor: '#F0F8FF',
    marginVertical: 10,
  },
  declaration: {
    fontSize: 14,
    color: '#555',
  },
  submitButton: {
    backgroundColor: '#ffc107',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
});

export default PlaygroundReservation;