import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Added import for Picker
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';

// Validation schema for the form
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
  idNumber: Yup.string().required('ID number is required'),
  telephone: Yup.string().required('Telephone number is required'),
  event: Yup.string().required('Event description is required'),
  date: Yup.string().required('Date is required'),
  communityhall: Yup.string().required('Commuintyhall selection is required'),
  agree: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
});

const CommunityhallReservation = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // State to hold selected date

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Communityhall Reservation</Text>

        {/* Form Section */}
        <Formik
          initialValues={{
            name: '',
            address: '',
            idNumber: '',
            telephone: '',
            event: '',
            date: '',
            communityhall: '',
            agree: false,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values); // Handle form submission
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
              {touched.name && errors.name && (
                <Text style={styles.error}>{errors.name}</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Address"
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                value={values.address}
              />
              {touched.address && errors.address && (
                <Text style={styles.error}>{errors.address}</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="ID Number"
                onChangeText={handleChange('idNumber')}
                onBlur={handleBlur('idNumber')}
                value={values.idNumber}
              />
              {touched.idNumber && errors.idNumber && (
                <Text style={styles.error}>{errors.idNumber}</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Telephone Number"
                onChangeText={handleChange('telephone')}
                onBlur={handleBlur('telephone')}
                value={values.telephone}
              />
              {touched.telephone && errors.telephone && (
                <Text style={styles.error}>{errors.telephone}</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="What is Held (Event Description)"
                onChangeText={handleChange('event')}
                onBlur={handleBlur('event')}
                value={values.event}
              />
              {touched.event && errors.event && (
                <Text style={styles.error}>{errors.event}</Text>
              )}

              {/* Playground Picker */}
              <Picker
                selectedValue={values.playground}
                style={styles.picker}
                onValueChange={(itemValue) => setFieldValue('communityhall', itemValue)}
              >
                <Picker.Item label="Select Commuintyhall" value="" />
                <Picker.Item label="Commuintyhall A" value="Commuintyhall A" />
                <Picker.Item label="Commuintyhall B" value="Commuintyhall B" />
                <Picker.Item label="Commuintyhall C" value="Commuintyhall C" />
              </Picker>
              {touched.playground && errors.playground && (
                <Text style={styles.error}>{errors.playground}</Text>
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
              {touched.date && errors.date && (
                <Text style={styles.error}>{errors.date}</Text>
              )}

              {/* Declaration in a box */}
              <View style={styles.declarationBox}>
                <Text style={styles.declaration}>
                  By reserving this communityhall, I agree to the terms and conditions:
                  {'\n'}- No damage to property.{'\n'}- Follow all rules and regulations.
                </Text>
              </View>

              {/* Radio Button for Agreement */}
              <TouchableOpacity
                style={styles.radioContainer}
                onPress={() => setFieldValue('agree', !values.agree)}
              >
                <View style={styles.radioButton}>
                  {values.agree && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.radioText}>I Agree</Text>
              </TouchableOpacity>
              {touched.agree && errors.agree && (
                <Text style={styles.error}>{errors.agree}</Text>
              )}

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
  picker: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#F0F8FF',
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

export default CommunityhallReservation;