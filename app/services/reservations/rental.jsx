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
import { submitReservation } from '../../../services/reservationService'; // Adjust the path as needed

// Validation schema for the form
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
  idNumber: Yup.string().required('ID number is required'),
  telephone: Yup.string().required('Telephone number is required'),
  daysWanted: Yup.number()
    .required('Number of days is required')
    .min(1, 'At least 1 day is required'),
  agree: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
});

const ExcavatorRent = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userId, setUserId] = useState(null);
  const [dailyRate] = useState(4000); // Example daily rental rate (in your currency)

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

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Excavator Rental</Text>

        <Formik
          initialValues={{
            name: '',
            address: '',
            idNumber: '',
            telephone: '',
            daysWanted: '',
            agree: false,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const payload = {
              ...values,
              userId,
              reservationDate: selectedDate.toISOString().split('T')[0],
              totalCost: dailyRate * parseInt(values.daysWanted, 10),
            };

            console.log('Data sent to backend:', payload);

            try {
              await submitReservation(payload);
              alert('Excavator rental reservation submitted successfully');
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
                keyboardType="phone-pad"
                onChangeText={handleChange('telephone')}
                onBlur={handleBlur('telephone')}
                value={values.telephone}
              />
              {touched.telephone && errors.telephone && <Text style={styles.error}>{errors.telephone}</Text>}

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
                  onChange={handleDateChange}
                />
              )}

              <TextInput
                style={styles.input}
                placeholder="Number of Days Wanted"
                keyboardType="numeric"
                onChangeText={(text) => {
                  handleChange('daysWanted')(text);
                  setFieldValue('totalCost', dailyRate * (parseInt(text, 10) || 0));
                }}
                onBlur={handleBlur('daysWanted')}
                value={values.daysWanted}
              />
              {touched.daysWanted && errors.daysWanted && <Text style={styles.error}>{errors.daysWanted}</Text>}

              {/* Display calculated cost */}
              {values.daysWanted && (
                <Text style={styles.totalCostText}>
                  Total Cost: {(dailyRate * parseInt(values.daysWanted, 10)).toLocaleString()} LKR
                </Text>
              )}

              {/* Declaration */}
              <View style={styles.declarationBox}>
                <Text style={styles.declaration}>
                  By renting this excavator, I agree to the terms and conditions:
                  {'\n'}- Proper use of the equipment.{'\n'}- Return in good condition.{'\n'}- Rent per Day-Rs. 4000
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
                <Text style={styles.buttonText}>Proceed to Payment</Text>
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
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
  },
  datePickerText: {
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
  totalCostText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d9534f',
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default ExcavatorRent;

