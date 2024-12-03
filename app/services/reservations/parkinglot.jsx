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
import { submitReservation } from '../../../services/reservationService'; // Adjust the path as per your folder structure

// Validation schema for the form
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
  idNumber: Yup.string().required('ID number is required'),
  telephone: Yup.string().required('Telephone number is required'),
  event: Yup.string().required('Event description is required'),
  date: Yup.string().required('Date is required'),
  agree: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
});

const ParkinglotReservation = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userId, setUserId] = useState(null);

  // Fetch user ID from secure storage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserDetails = await SecureStore.getItemAsync('userDetails');
        if (storedUserDetails) {
          const { userId } = JSON.parse(storedUserDetails);
          setUserId(userId);
        }
      } catch (error) {
        console.error('Failed to fetch user ID:', error);
      }
    };
    fetchUserId();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Parkinglot Reservation</Text>

        <Formik
          initialValues={{
            name: '',
            address: '',
            idNumber: '',
            telephone: '',
            event: '',
            date: '',
            agree: false,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const payload = {
              ...values,
              userId,  // User's ID
              reservationId: 4,  // Reservation ID for playground (static value)
              date: selectedDate.toISOString().split('T')[0],
            };

            // Log the payload to the console
            console.log('Data sent to backend:', payload);

            try {
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
              <TextInput
                style={styles.input}
                placeholder="Name"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />
              {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Address"
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                value={values.address}
              />
              {touched.address && errors.address && <Text style={styles.error}>{errors.address}</Text>}

              <TextInput
                style={styles.input}
                placeholder="ID Number"
                onChangeText={handleChange('idNumber')}
                onBlur={handleBlur('idNumber')}
                value={values.idNumber}
              />
              {touched.idNumber && errors.idNumber && <Text style={styles.error}>{errors.idNumber}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Telephone Number"
                onChangeText={handleChange('telephone')}
                onBlur={handleBlur('telephone')}
                value={values.telephone}
              />
              {touched.telephone && errors.telephone && <Text style={styles.error}>{errors.telephone}</Text>}

              <TextInput
                style={styles.input}
                placeholder="What is Held (Event Description)"
                onChangeText={handleChange('event')}
                onBlur={handleBlur('event')}
                value={values.event}
              />
              {touched.event && errors.event && <Text style={styles.error}>{errors.event}</Text>}

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

              {/* Declaration in a box */}
              <View style={styles.declarationBox}>
                <Text style={styles.declaration}>
                  By reserving this parkinglot, I agree to the terms and conditions:
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

export default ParkinglotReservation;