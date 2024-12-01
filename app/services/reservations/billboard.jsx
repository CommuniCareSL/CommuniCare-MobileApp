import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { launchImageLibrary } from 'react-native-image-picker';

// Validation schema for the form
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
  idNumber: Yup.string().required('ID number is required'),
  telephone: Yup.string().required('Telephone number is required'),
  businessName: Yup.string().required('Business name is required'),
  place: Yup.string().required('Billboard location is required'),
  advertisement: Yup.string().required('Advertisement image is required'),
  agree: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
});

const BillboardReservation = () => {
  const [image, setImage] = useState(null); // State to hold the uploaded image

  // Function to handle image selection
  const handleImageUpload = () => {
    launchImageLibrary(
      {
        mediaType: 'photo', // Restrict to photos only
        quality: 1, // Set quality to highest (1)
        includeBase64: false, // Base64 encoding is not necessary
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          setImage(response.assets[0]); // Save the selected image
        }
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Billboard Reservation</Text>

        {/* Form Section */}
        <Formik
          initialValues={{
            name: '',
            address: '',
            idNumber: '',
            telephone: '',
            businessName: '',
            place: '',
            advertisement: '',
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
                placeholder="Business Name"
                onChangeText={handleChange('businessName')}
                onBlur={handleBlur('businessName')}
                value={values.businessName}
              />
              {touched.businessName && errors.businessName && (
                <Text style={styles.error}>{errors.businessName}</Text>
              )}

              {/* Place Picker (Billboard Location) */}
              <Picker
                selectedValue={values.place}
                style={styles.picker}
                onValueChange={(itemValue) => setFieldValue('place', itemValue)}
              >
                <Picker.Item label="Select Billboard Location" value="" />
                <Picker.Item label="Location A" value="Location A" />
                <Picker.Item label="Location B" value="Location B" />
                <Picker.Item label="Location C" value="Location C" />
              </Picker>
              {touched.place && errors.place && (
                <Text style={styles.error}>{errors.place}</Text>
              )}

              {/* Image Upload Button */}
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleImageUpload}
              >
                <Text style={styles.uploadButtonText}>
                  {image ? 'Change Advertisement Image' : 'Upload Advertisement Image'}
                </Text>
              </TouchableOpacity>
              {image && (
                <View style={styles.imagePreview}>
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.image}
                  />
                  <Text style={styles.imageText}>{image.fileName}</Text>
                </View>
              )}
              {touched.advertisement && errors.advertisement && (
                <Text style={styles.error}>{errors.advertisement}</Text>
              )}

              {/* Declaration in a box */}
              <View style={styles.declarationBox}>
                <Text style={styles.declaration}>
                  By reserving this billboard, I agree to the terms and conditions:
                  {'\n'}- No damage to property.{'\n'}- Follow all advertising rules.
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
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#F0F8FF',
  },
  uploadButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    marginTop: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  imageText: {
    marginTop: 5,
    fontSize: 14,
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
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
});

export default BillboardReservation;