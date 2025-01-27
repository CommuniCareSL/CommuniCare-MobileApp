import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PaymentGateway from "../../../components/payment/PaymentGateway";
import LocationPicker from '../../../components/complaint/LocationPicker';
import { submitGullyReservation } from '../../../services/reservations/gullyService';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const validationSchema = Yup.object().shape({
  telephone: Yup.string().required('Telephone number is required'),
  frequency: Yup.number()
    .required('Frequency is required')
    .min(1, 'Minimum 1 frequency'),
  agree: Yup.boolean().oneOf([true], 'You must agree to the terms'),
});

const GullyBowserReservation = () => {
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [totalPayment, setTotalPayment] = useState(0);
  const [userId, setUserId] = useState(null);
  const [sabhaId, setSabhaId] = useState(null);
  const PRICE_PER_FREQUENCY = 5000;
  const router = useRouter();

  const termsAndConditions = [
    "Bowser could reach the gully without any disturbance",
    "Advance payment required for confirmation",
    "The gullies should remain liquid",
    "Late arrivals will not receive time extension",
    "Damage to equipment will incur penalty charges",
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedUserDetails = await SecureStore.getItemAsync("userDetails");
        if (storedUserDetails) {
          const { userId, sabhaId } = JSON.parse(storedUserDetails);
          setUserId(userId);
          setSabhaId(sabhaId);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        Alert.alert("Error", "Failed to load user information");
      }
    };
    fetchUserDetails();
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowMap(false);
  };

  const calculateTotal = (frequency) => frequency * PRICE_PER_FREQUENCY;

  const handleSubmit = (values) => {
    if (!selectedLocation) {
      Alert.alert("Error", "Please select a location from the map");
      return;
    }
    const total = calculateTotal(values.frequency);
    setTotalPayment(total);
    setPaymentModalVisible(true);
  };

  const handlePaymentSuccess = async (values) => {
    try {
      const payload = {
        ...values,
        userId,
        sabhaId,
        location: `${selectedLocation.latitude},${selectedLocation.longitude}`,
        totalPayment,
      };
      await submitGullyReservation(payload);
      Alert.alert("Success", "Reservation submitted successfully!");
      setPaymentModalVisible(false);
      router.replace('/services');
    } catch (error) {
      Alert.alert("Error", error.message || "Reservation failed");
    }
  };

  if (showMap) {
    return <LocationPicker onLocationSelect={handleLocationSelect} onClose={() => setShowMap(false)} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Gully Bowser Reservation</Text>
        <Text style={styles.priceText}>Rs. {PRICE_PER_FREQUENCY} per frequency</Text>

        <Formik
          initialValues={{ telephone: '', frequency: '', agree: false }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={() => setShowMap(true)}
                >
                  <Text style={[
                    styles.locationText,
                    !selectedLocation && styles.placeholderText
                  ]}>
                    {selectedLocation ? 
                      `Location: ${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}` : 
                      'Select Location from Map'}
                  </Text>
                  <Image 
                    source={require('../../../assets/images/location.png')} 
                    style={styles.locationIcon} 
                  />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Telephone Number"
                placeholderTextColor="#666"
                onChangeText={handleChange('telephone')}
                onBlur={handleBlur('telephone')}
                value={values.telephone}
                keyboardType="phone-pad"
              />
              {touched.telephone && errors.telephone && (
                <Text style={styles.error}>{errors.telephone}</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Number of Frequencies"
                placeholderTextColor="#666"
                onChangeText={(value) => {
                  handleChange('frequency')(value);
                  setTotalPayment(calculateTotal(Number(value)));
                }}
                onBlur={handleBlur('frequency')}
                value={values.frequency}
                keyboardType="numeric"
              />
              {touched.frequency && errors.frequency && (
                <Text style={styles.error}>{errors.frequency}</Text>
              )}

              <Text style={styles.totalText}>Total: Rs. {totalPayment}</Text>

              <View style={styles.termsContainer}>
                <Text style={styles.termsTitle}>Terms & Conditions:</Text>
                {termsAndConditions.map((term, index) => (
                  <View key={index} style={styles.termItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.termText}>{term}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setFieldValue('agree', !values.agree)}
                >
                  {values.agree && <View style={styles.radioInner} />}
                </TouchableOpacity>
                <Text style={styles.radioText}>I agree to the terms & conditions</Text>
              </View>
              {touched.agree && errors.agree && (
                <Text style={styles.error}>{errors.agree}</Text>
              )}

              <TouchableOpacity
                style={[styles.submitButton, !values.agree && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={!values.agree}
              >
                <Text style={styles.buttonText}>Proceed to Payment</Text>
              </TouchableOpacity>

              <PaymentGateway
                visible={isPaymentModalVisible}
                onClose={() => setPaymentModalVisible(false)}
                onPaymentSuccess={() => handlePaymentSuccess(values)}
                totalPayment={totalPayment}
              />
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
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  priceText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    paddingHorizontal: 10,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#F0F8FF',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  locationText: {
    fontSize: 16,
    flex: 1,
  },
  placeholderText: {
    color: '#888',
  },
  locationIcon: {
    width: 24,
    height: 24,
    tintColor: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#F0F8FF',
    color: '#333',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
  },
  termsContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  termItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    color: '#666',
  },
  termText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#28a745',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#ffc107',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#dc3545',
    fontSize: 14,
    marginBottom: 5,
    marginLeft: 5,
  },
});

export default GullyBowserReservation;