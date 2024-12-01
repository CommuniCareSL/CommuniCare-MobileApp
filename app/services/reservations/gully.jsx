import React, { useState } from 'react';
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

// Validation schema for the form
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
  idNumber: Yup.string().required('ID number is required'),
  telephone: Yup.string().required('Telephone number is required'),
  location: Yup.string().required('Location is required'),
  frequency: Yup.string().required('Expected frequency is required'),
  agree: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
});

const GullyBowserReservation = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Gully Bowser Reservation</Text>

        {/* Form Section */}
        <Formik
          initialValues={{
            name: '',
            address: '',
            idNumber: '',
            telephone: '',
            location: '',
            frequency: '',
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
                placeholder="Location"
                onChangeText={handleChange('location')}
                onBlur={handleBlur('location')}
                value={values.location}
              />
              {touched.location && errors.location && (
                <Text style={styles.error}>{errors.location}</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Expected Frequency"
                onChangeText={handleChange('frequency')}
                onBlur={handleBlur('frequency')}
                value={values.frequency}
              />
              {touched.frequency && errors.frequency && (
                <Text style={styles.error}>{errors.frequency}</Text>
              )}

              {/* Declaration in a box */}
              <View style={styles.declarationBox}>
                <Text style={styles.declaration}>
                  By reserving the gully bowser, I agree to the terms and conditions:
                  {'\n'}- Use the service responsibly.{'\n'}- Pay the required fees promptly.
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
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
});

export default GullyBowserReservation;