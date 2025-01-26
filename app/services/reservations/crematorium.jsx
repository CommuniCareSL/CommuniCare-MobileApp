import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SecureStore from "expo-secure-store";
import RNPickerSelect from "react-native-picker-select";
import PaymentGateway from "../../../components/payment/PaymentGateway";
import {
  submitCrematoriumReservation,
  fetchCrematoriumsBySabhaId,
  fetchBookedSlots,
} from "../../../services/reservations/crematoriumService";

const validationSchema = Yup.object().shape({
  deceasedName: Yup.string().required("Name of the deceased is required"),
  deceasedAddress: Yup.string().required("Address is required"),
  dateOfDeath: Yup.date()
    .required("Date of death is required")
    .max(new Date(), "Date of death cannot be in the future"),
  notifierName: Yup.string().required("Name of notifier is required"),
  notifierAddress: Yup.string().required("Address of notifier is required"),
  relationship: Yup.string().required("Relationship is required"),
  funeralDate: Yup.date()
    .required("Funeral date is required")
    .min(new Date(), "Funeral date cannot be in the past"),
  timeSlot: Yup.string()
    .required("Time slot is required")
    .test(
      'is-slot-available',
      'This slot is already booked',
      (value, context) => !context.parent.bookedSlots.includes(value)
    ),
  crematoriumId: Yup.string().required("Crematorium selection is required"),
});

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CrematoriumReservationScreen = () => {
  const [showDeathDatePicker, setShowDeathDatePicker] = useState(false);
  const [showFuneralDatePicker, setShowFuneralDatePicker] = useState(false);
  const [userId, setUserId] = useState(null);
  const [sabhaId, setSabhaId] = useState(null);
  const [crematoriums, setCrematoriums] = useState([]);
  const [selectedCrematorium, setSelectedCrematorium] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedUserDetails = await SecureStore.getItemAsync("userDetails");
        if (storedUserDetails) {
          const userData = JSON.parse(storedUserDetails);
          setUserId(userData.userId);
          setSabhaId(userData.sabhaId);
          
          const data = await fetchCrematoriumsBySabhaId(userData.sabhaId);
          setCrematoriums(data);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load crematoriums");
      }
    };
    fetchUserDetails();
  }, []);

  const handlePaymentSuccess = async (values) => {
    try {
      if (!values.funeralDate || !values.dateOfDeath) {
        throw new Error("Please select valid dates");
      }

      if (new Date(values.funeralDate) < new Date(values.dateOfDeath)) {
        throw new Error("Funeral date cannot be before date of death");
      }

      const payload = {
        ...values,
        userId,
        crematoriumId: selectedCrematorium.crematoriumId,
        dateOfDeath: formatDate(values.dateOfDeath), // Use formatted date
        funeralDate: formatDate(values.funeralDate), // Use formatted date
        payment: totalPayment,
      };

      await submitCrematoriumReservation(payload);
      await updateBookedSlots(payload.crematoriumId, payload.funeralDate);
      Alert.alert("Success", "Reservation submitted successfully!");
      setPaymentModalVisible(false);
    } catch (error) {
      Alert.alert("Error", error.message || "Reservation failed");
    }
  };

  const updateBookedSlots = async (crematoriumId, date) => {
    try {
      if (!date || isNaN(new Date(date).getTime())) {
        throw new Error("Invalid date format");
      }

      if (crematoriumId && date) {
        const slots = await fetchBookedSlots(crematoriumId, date);
        setBookedSlots(slots);
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to fetch time slots");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Crematorium Reservation</Text>
        </View>

        <View style={styles.content}>
          <Image
            source={require("../../../assets/images/service.png")}
            style={styles.profileImage}
          />
          <View style={styles.jobDetails}>
            <Text style={styles.jobTitle}>Reserve Crematorium</Text>
            {selectedCrematorium && (
              <Text style={styles.salary}>Rs: {selectedCrematorium.price} per slot</Text>
            )}
          </View>
        </View>

        <Formik
          initialValues={{
            deceasedName: "",
            deceasedAddress: "",
            dateOfDeath: null,
            notifierName: "",
            notifierAddress: "",
            relationship: "",
            funeralDate: null,
            timeSlot: "",
            crematoriumId: "",
            bookedSlots: [],
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            setTotalPayment(selectedCrematorium?.price || 0);
            setPaymentModalVisible(true);
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
              {/* Crematorium Selection */}
              <View style={styles.dropdownContainer}>
                <RNPickerSelect
                  placeholder={{ label: "Select Crematorium", value: null }}
                  items={crematoriums.map(c => ({
                    label: c.name,
                    value: c.crematoriumId,
                  }))}
                  onValueChange={(value) => {
                    setFieldValue("crematoriumId", value);
                    const selected = crematoriums.find(c => c.crematoriumId === value);
                    setSelectedCrematorium(selected);
                    setTotalPayment(selected?.price || 0);
                  }}
                  value={values.crematoriumId}
                />
              </View>
              {touched.crematoriumId && errors.crematoriumId && (
                <Text style={styles.error}>{errors.crematoriumId}</Text>
              )}

              {/* Deceased Name */}
              <TextInput
                style={styles.input}
                placeholder="Name of the deceased"
                onChangeText={handleChange("deceasedName")}
                onBlur={handleBlur("deceasedName")}
                value={values.deceasedName}
              />
              {touched.deceasedName && errors.deceasedName && (
                <Text style={styles.error}>{errors.deceasedName}</Text>
              )}

              {/* Deceased Address */}
              <TextInput
                style={styles.input}
                placeholder="Address of the deceased"
                onChangeText={handleChange("deceasedAddress")}
                onBlur={handleBlur("deceasedAddress")}
                value={values.deceasedAddress}
              />
              {touched.deceasedAddress && errors.deceasedAddress && (
                <Text style={styles.error}>{errors.deceasedAddress}</Text>
              )}

              {/* Date of Death Picker */}
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDeathDatePicker(true)}
              >
                <Text style={styles.datePickerText}>
                  {values.dateOfDeath
                    ? new Date(values.dateOfDeath).toDateString()
                    : "Select Date of Death"}
                </Text>
              </TouchableOpacity>
              {showDeathDatePicker && (
                <DateTimePicker
                  value={values.dateOfDeath || new Date()}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowDeathDatePicker(false);
                    if (selectedDate) {
                      setFieldValue("dateOfDeath", selectedDate);
                    }
                  }}
                />
              )}
              {touched.dateOfDeath && errors.dateOfDeath && (
                <Text style={styles.error}>{errors.dateOfDeath}</Text>
              )}

              {/* Notifier Name */}
              <TextInput
                style={styles.input}
                placeholder="Name of notifier"
                onChangeText={handleChange("notifierName")}
                onBlur={handleBlur("notifierName")}
                value={values.notifierName}
              />
              {touched.notifierName && errors.notifierName && (
                <Text style={styles.error}>{errors.notifierName}</Text>
              )}

              {/* Notifier Address */}
              <TextInput
                style={styles.input}
                placeholder="Address of notifier"
                onChangeText={handleChange("notifierAddress")}
                onBlur={handleBlur("notifierAddress")}
                value={values.notifierAddress}
              />
              {touched.notifierAddress && errors.notifierAddress && (
                <Text style={styles.error}>{errors.notifierAddress}</Text>
              )}

              {/* Relationship */}
              <TextInput
                style={styles.input}
                placeholder="Relationship to deceased"
                onChangeText={handleChange("relationship")}
                onBlur={handleBlur("relationship")}
                value={values.relationship}
              />
              {touched.relationship && errors.relationship && (
                <Text style={styles.error}>{errors.relationship}</Text>
              )}

              {/* Funeral Date Picker */}
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowFuneralDatePicker(true)}
              >
                <Text style={styles.datePickerText}>
                  {values.funeralDate
                    ? new Date(values.funeralDate).toDateString()
                    : "Select Funeral Date"}
                </Text>
              </TouchableOpacity>
              {showFuneralDatePicker && (
                <DateTimePicker
                  value={values.funeralDate || new Date()}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowFuneralDatePicker(false);
                    if (selectedDate) {
                      setFieldValue("funeralDate", selectedDate);
                      updateBookedSlots(values.crematoriumId, formatDate(selectedDate));
                    }
                  }}
                />
              )}
              {touched.funeralDate && errors.funeralDate && (
                <Text style={styles.error}>{errors.funeralDate}</Text>
              )}

              {/* Time Slot Selection */}
              <Text style={styles.label}>Select Time Slot:</Text>
              {["10-12", "1-3", "3-5"].map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = values.timeSlot === slot;
                
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.timeSlot,
                      isSelected && styles.selectedTimeSlot,
                      isBooked && styles.disabledSlot,
                    ]}
                    onPress={() => !isBooked && setFieldValue("timeSlot", slot)}
                    disabled={isBooked}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      isBooked && styles.disabledText
                    ]}>
                      {slot}
                      {isBooked && " (Booked)"}
                      {isSelected && !isBooked && " (Selected)"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {touched.timeSlot && errors.timeSlot && (
                <Text style={styles.error}>{errors.timeSlot}</Text>
              )}

              {/* Submit Button */}
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>
                  Proceed to Payment (Rs. {totalPayment})
                </Text>
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
    backgroundColor: "#fff",
    paddingBottom: 30,
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  salary: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  datePickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  datePickerText: {
    color: "#000",
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  timeSlot: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedTimeSlot: {
    backgroundColor: "#ffe082",
    borderColor: "#ffc107",
  },
  disabledSlot: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc",
  },
  timeSlotText: {
    color: "#000",
    fontSize: 16,
    textAlign: "center",
  },
  disabledText: {
    color: "#888",
  },
  button: {
    backgroundColor: "#ffc107",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  error: {
    color: "#dc3545",
    fontSize: 14,
    marginBottom: 10,
    marginTop: -5,
  },
});

export default CrematoriumReservationScreen;



// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   TextInput,
//   Platform,
//   ScrollView,
// } from 'react-native';
// import { Formik } from 'formik';
// import * as Yup from 'yup';
// import DateTimePicker from '@react-native-community/datetimepicker';

// // Validation schema for the form
// const validationSchema = Yup.object().shape({
//   deceasedName: Yup.string().required('Name of the deceased is required'),
//   deceasedAddress: Yup.string().required('Address is required'),
//   dateOfDeath: Yup.date().required('Date of death is required'),
//   notifierName: Yup.string().required('Name of notifier is required'),
//   notifierAddress: Yup.string().required('Address of notifier is required'),
//   relationship: Yup.string().required('Relationship is required'),
//   funeralDate: Yup.date().required('Funeral date is required'),
//   timeSlot: Yup.string().required('Time slot is required'),
// });

// const CrematoriumReservationScreen = () => {
//   const [showDeathDatePicker, setShowDeathDatePicker] = useState(false);
//   const [showFuneralDatePicker, setShowFuneralDatePicker] = useState(false);

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Crematorium Reservation</Text>
//         </View>
        
//         <View style={styles.content}>
//           <Image
//             source={require('../../../assets/images/service.png')}
//             style={styles.profileImage}
//           />
//           <View style={styles.jobDetails}>
//             <Text style={styles.jobTitle}>Reserve Crematorium</Text>
//             <Text style={styles.salary}>Rs: 8500 per slot</Text>
//           </View>
//         </View>

//         {/* Form Section */}
//         <Formik
//           initialValues={{
//             deceasedName: '',
//             deceasedAddress: '',
//             dateOfDeath: null,
//             notifierName: '',
//             notifierAddress: '',
//             relationship: '',
//             funeralDate: null,
//             timeSlot: '',
//           }}
//           validationSchema={validationSchema}
//           onSubmit={async (values) => {
//             try {
//               await submitCrematoriumReservation(values);
//               console.log('Reservation submitted successfully!');
//               // Add navigation/feedback here
//             } catch (error) {
//               console.error('Submission failed:', error);
//             }
//           }}
//         >
//           {({
//             handleChange,
//             handleBlur,
//             handleSubmit,
//             setFieldValue,
//             values,
//             errors,
//             touched,
//           }) => (
//             <View style={styles.form}>
//               {/* Deceased Information */}
//               <TextInput
//                 style={styles.input}
//                 placeholder="Name of the deceased"
//                 onChangeText={handleChange('deceasedName')}
//                 onBlur={handleBlur('deceasedName')}
//                 value={values.deceasedName}
//               />
//               {touched.deceasedName && errors.deceasedName && (
//                 <Text style={styles.error}>{errors.deceasedName}</Text>
//               )}

//               <TextInput
//                 style={styles.input}
//                 placeholder="Address of the deceased"
//                 onChangeText={handleChange('deceasedAddress')}
//                 onBlur={handleBlur('deceasedAddress')}
//                 value={values.deceasedAddress}
//               />
//               {touched.deceasedAddress && errors.deceasedAddress && (
//                 <Text style={styles.error}>{errors.deceasedAddress}</Text>
//               )}

//               {/* Date of Death Picker */}
//               <TouchableOpacity
//                 style={styles.datePickerButton}
//                 onPress={() => setShowDeathDatePicker(true)}
//               >
//                 <Text style={styles.datePickerText}>
//                   {values.dateOfDeath ? 
//                     new Date(values.dateOfDeath).toDateString() : 
//                     'Select Date of Death'}
//                 </Text>
//               </TouchableOpacity>
//               {showDeathDatePicker && (
//                 <DateTimePicker
//                   value={values.dateOfDeath || new Date()}
//                   mode="date"
//                   display="default"
//                   onChange={(event, selectedDate) => {
//                     setShowDeathDatePicker(false);
//                     selectedDate && setFieldValue('dateOfDeath', selectedDate);
//                   }}
//                 />
//               )}
//               {touched.dateOfDeath && errors.dateOfDeath && (
//                 <Text style={styles.error}>{errors.dateOfDeath}</Text>
//               )}

//               {/* Notifier Information */}
//               <TextInput
//                 style={styles.input}
//                 placeholder="Name of notifier"
//                 onChangeText={handleChange('notifierName')}
//                 onBlur={handleBlur('notifierName')}
//                 value={values.notifierName}
//               />
//               {touched.notifierName && errors.notifierName && (
//                 <Text style={styles.error}>{errors.notifierName}</Text>
//               )}

//               <TextInput
//                 style={styles.input}
//                 placeholder="Address of notifier"
//                 onChangeText={handleChange('notifierAddress')}
//                 onBlur={handleBlur('notifierAddress')}
//                 value={values.notifierAddress}
//               />
//               {touched.notifierAddress && errors.notifierAddress && (
//                 <Text style={styles.error}>{errors.notifierAddress}</Text>
//               )}

//               <TextInput
//                 style={styles.input}
//                 placeholder="Relationship to deceased"
//                 onChangeText={handleChange('relationship')}
//                 onBlur={handleBlur('relationship')}
//                 value={values.relationship}
//               />
//               {touched.relationship && errors.relationship && (
//                 <Text style={styles.error}>{errors.relationship}</Text>
//               )}

//               {/* Funeral Date Picker */}
//               <TouchableOpacity
//                 style={styles.datePickerButton}
//                 onPress={() => setShowFuneralDatePicker(true)}
//               >
//                 <Text style={styles.datePickerText}>
//                   {values.funeralDate ? 
//                     new Date(values.funeralDate).toDateString() : 
//                     'Select Funeral Date'}
//                 </Text>
//               </TouchableOpacity>
//               {showFuneralDatePicker && (
//                 <DateTimePicker
//                   value={values.funeralDate || new Date()}
//                   mode="date"
//                   display="default"
//                   onChange={(event, selectedDate) => {
//                     setShowFuneralDatePicker(false);
//                     selectedDate && setFieldValue('funeralDate', selectedDate);
//                   }}
//                 />
//               )}
//               {touched.funeralDate && errors.funeralDate && (
//                 <Text style={styles.error}>{errors.funeralDate}</Text>
//               )}

//               {/* Time Slot Selection */}
//               <Text style={styles.label}>Select Time Slot:</Text>
//               {['10-12', '1-3', '3-5'].map((slot) => (
//                 <TouchableOpacity
//                   key={slot}
//                   style={[
//                     styles.timeSlot,
//                     values.timeSlot === slot && styles.selectedTimeSlot,
//                   ]}
//                   onPress={() => setFieldValue('timeSlot', slot)}
//                 >
//                   <Text style={styles.timeSlotText}>{slot}</Text>
//                 </TouchableOpacity>
//               ))}
//               {touched.timeSlot && errors.timeSlot && (
//                 <Text style={styles.error}>{errors.timeSlot}</Text>
//               )}

//               {/* Submit Button */}
//               <TouchableOpacity 
//                 style={styles.button} 
//                 onPress={handleSubmit}
//               >
//                 <Text style={styles.buttonText}>Submit Reservation</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </Formik>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingBottom: 30,
//   },
//   header: {
//     padding: 20,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   content: {
//     flexDirection: 'row',
//     padding: 20,
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 50,
//     marginRight: 20,
//   },
//   jobDetails: {
//     flex: 1,
//   },
//   jobTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 5,
//   },
//   salary: {
//     fontSize: 16,
//     color: '#666',
//   },
//   form: {
//     paddingHorizontal: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   datePickerButton: {
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     marginBottom: 15,
//   },
//   datePickerText: {
//     color: '#000',
//     fontSize: 16,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//     color: '#333',
//   },
//   timeSlot: {
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   selectedTimeSlot: {
//     backgroundColor: '#ffe082',
//     borderColor: '#ffc107',
//   },
//   timeSlotText: {
//     color: '#000',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   button: {
//     backgroundColor: '#ffc107',
//     padding: 15,
//     borderRadius: 8,
//     marginTop: 20,
//   },
//   buttonText: {
//     color: '#000',
//     fontWeight: 'bold',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   error: {
//     color: '#dc3545',
//     fontSize: 14,
//     marginBottom: 10,
//     marginTop: -5,
//   },
// });

// export default CrematoriumReservationScreen;


