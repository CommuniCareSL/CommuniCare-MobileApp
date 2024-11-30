import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';

// Validation schema for the form
const validationSchema = Yup.object().shape({
  deceasedName: Yup.string().required('Name of the deceased is required'),
  deceasedAddress: Yup.string().required('Address is required'),
  dateOfDeath: Yup.string().required('Date of death is required'),
  notifierName: Yup.string().required('Name of notifier is required'),
  notifierAddress: Yup.string().required('Address of notifier is required'),
  idNumber: Yup.string().required('ID number is required'),
  funeralDate: Yup.string().required('Funeral date is required'),
  timeSlot: Yup.string().required('Time slot is required'),
});

const Screen = () => {
  const [showDeathDatePicker, setShowDeathDatePicker] = useState(false);
  const [showFuneralDatePicker, setShowFuneralDatePicker] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Crematorial Reservation</Text>
        </View>
        <View style={styles.content}>
          <Image
            source={require('../../assets/images/service.png')}
            style={styles.profileImage}
          />
          <View style={styles.jobDetails}>
            <Text style={styles.jobTitle}>Reserve Crematorial</Text>
            <Text style={styles.salary}>Rs:8500 per</Text>
          </View>
        </View>

        {/* Form Section */}
        <Formik
          initialValues={{
            deceasedName: '',
            deceasedAddress: '',
            dateOfDeath: '',
            notifierName: '',
            notifierAddress: '',
            idNumber: '',
            funeralDate: '',
            timeSlot: '',
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
                placeholder="Name of the deceased"
                onChangeText={handleChange('deceasedName')}
                onBlur={handleBlur('deceasedName')}
                value={values.deceasedName}
              />
              {touched.deceasedName && errors.deceasedName && (
                <Text style={styles.error}>{errors.deceasedName}</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Address of the deceased"
                onChangeText={handleChange('deceasedAddress')}
                onBlur={handleBlur('deceasedAddress')}
                value={values.deceasedAddress}
              />
              {touched.deceasedAddress && errors.deceasedAddress && (
                <Text style={styles.error}>{errors.deceasedAddress}</Text>
              )}

              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDeathDatePicker(true)}
              >
                <Text style={styles.datePickerText}>
                  {values.dateOfDeath || 'Select Date of Death'}
                </Text>
              </TouchableOpacity>
              {showDeathDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDeathDatePicker(false);
                    if (selectedDate) {
                      setFieldValue(
                        'dateOfDeath',
                        selectedDate.toISOString().split('T')[0]
                      );
                    }
                  }}
                />
              )}
              {touched.dateOfDeath && errors.dateOfDeath && (
                <Text style={styles.error}>{errors.dateOfDeath}</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Name of Notifier"
                onChangeText={handleChange('notifierName')}
                onBlur={handleBlur('notifierName')}
                value={values.notifierName}
              />
              {touched.notifierName && errors.notifierName && (
                <Text style={styles.error}>{errors.notifierName}</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Address of Notifier"
                onChangeText={handleChange('notifierAddress')}
                onBlur={handleBlur('notifierAddress')}
                value={values.notifierAddress}
              />
              {touched.notifierAddress && errors.notifierAddress && (
                <Text style={styles.error}>{errors.notifierAddress}</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="ID number of Informant"
                onChangeText={handleChange('idNumber')}
                onBlur={handleBlur('idNumber')}
                value={values.idNumber}
              />
              {touched.idNumber && errors.idNumber && (
                <Text style={styles.error}>{errors.idNumber}</Text>
              )}

              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowFuneralDatePicker(true)}
              >
                <Text style={styles.datePickerText}>
                  {values.funeralDate || 'Select Funeral Date'}
                </Text>
              </TouchableOpacity>
              {showFuneralDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowFuneralDatePicker(false);
                    if (selectedDate) {
                      setFieldValue(
                        'funeralDate',
                        selectedDate.toISOString().split('T')[0]
                      );
                    }
                  }}
                />
              )}
              {touched.funeralDate && errors.funeralDate && (
                <Text style={styles.error}>{errors.funeralDate}</Text>
              )}

              <Text style={styles.label}>Select Time Slot:</Text>
              {['10-12', '1-3', '3-5'].map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.timeSlot,
                    values.timeSlot === slot && styles.selectedTimeSlot,
                  ]}
                  onPress={() => setFieldValue('timeSlot', slot)}
                >
                  <Text style={styles.timeSlotText}>{slot}</Text>
                </TouchableOpacity>
              ))}
              {touched.timeSlot && errors.timeSlot && (
                <Text style={styles.error}>{errors.timeSlot}</Text>
              )}

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 20,
  },
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  salary: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  form: {
    padding: 20,
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
  },
  datePickerText: {
    color: '#000',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  timeSlot: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#ffc107',
  },
  timeSlotText: {
    color: '#000',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ffc107',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
});

export default Screen;


