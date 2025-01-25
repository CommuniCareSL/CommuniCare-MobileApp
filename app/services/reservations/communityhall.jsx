import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Calendar, LocaleConfig } from "react-native-calendars";
import * as SecureStore from "expo-secure-store";
import RNPickerSelect from "react-native-picker-select";
import PaymentGateway from "../../../components/payment/PaymentGateway";
import { useNavigation } from "@react-navigation/native";
import { submitReservation } from "../../../services/reservations/hallService";
import { fetchHallsBySabhaId } from "../../../services/reservations/hallService";
import { fetchBookedDatesByHallId } from "../../../services/reservations/hallService";
import { useRouter } from "expo-router";

// Configure locale for the calendar
LocaleConfig.locales["en"] = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};
LocaleConfig.defaultLocale = "en";

// Validation schema for the form
const validationSchema = Yup.object().shape({
  event: Yup.string().required("Event is required"),
  description: Yup.string().required("Description is required"),
  hallId: Yup.string().required("Hall selection is required"),
  agree: Yup.boolean().oneOf([true], "You must agree to the terms and conditions"),
});

const CommunityHallReservation = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [userId, setUserId] = useState(null);
  const [sabhaId, setSabhaId] = useState(null);
  const [halls, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [markedDates, setMarkedDates] = useState({});
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const formikRef = useRef();
  const navigation = useNavigation();
  const router = useRouter();

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedUserDetails = await SecureStore.getItemAsync("userDetails");
        if (storedUserDetails) {
          const { userId, sabhaId } = JSON.parse(storedUserDetails);
          setUserId(userId);
          setSabhaId(sabhaId);

          const hallsData = await fetchHallsBySabhaId(sabhaId);
          setHalls(hallsData);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  // Fetch booked dates
  useEffect(() => {
    if (selectedHall) {
      const fetchBookedDates = async () => {
        try {
          const bookedDatesData = await fetchBookedDatesByHallId(selectedHall.hallId);
          setBookedDates(bookedDatesData);
        } catch (error) {
          console.error("Failed to fetch booked dates:", error);
        }
      };

      fetchBookedDates();
    }
  }, [selectedHall]);

  // Generate available dates
  useEffect(() => {
    const today = new Date();
    const availableDatesArray = [];
    for (let i = 7; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      availableDatesArray.push(date.toISOString().split("T")[0]);
    }
    setAvailableDates(availableDatesArray);
  }, []);

  // Update marked dates
  useEffect(() => {
    const today = new Date();
    const next6Days = new Date(today);
    next6Days.setDate(today.getDate() + 6);

    const marked = {};

    for (let i = 0; i <= 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      marked[dateString] = {
        disabled: true,
        disableTouchEvent: true,
        color: "gray",
      };
    }

    bookedDates.forEach((date) => {
      marked[date] = { disabled: true, disableTouchEvent: true, color: "gray" };
    });

    availableDates.forEach((date) => {
      if (!marked[date]) {
        marked[date] = { disabled: false, color: "green" };
      }
    });

    setMarkedDates(marked);
  }, [bookedDates, availableDates]);

  // Calculate total payment
  useEffect(() => {
    if (selectedHall && selectedDate) {
      setTotalPayment(selectedHall.pricePerDay);
    } else {
      setTotalPayment(0);
    }
  }, [selectedDate, selectedHall]);

  // Handle form submission
  const handleFormSubmit = async (values, { resetForm }) => {
    const payload = {
      ...values,
      userId,
      sabhaId,
      reservationId: 1,
      dates: [selectedDate],
      totalPayment,
    };

    try {
      await submitReservation(payload);
      Alert.alert("Success", "Reservation submitted successfully");
      resetForm();
      setSelectedDate(null);
      setTotalPayment(0);
      router.replace("/services");
    } catch (error) {
      console.error("Reservation submission failed:", error);
      Alert.alert("Error", "Failed to submit reservation");
    }
  };

  // Render the form content
  const renderFormContent = ({
    handleChange,
    handleBlur,
    setFieldValue,
    values,
    errors,
    touched,
  }) => (
    <View>
      {/* Event Input */}
      <TextInput
        style={styles.input}
        placeholder="What is Held (Event)"
        onChangeText={handleChange("event")}
        onBlur={handleBlur("event")}
        value={values.event}
      />
      {touched.event && errors.event && (
        <Text style={styles.error}>{errors.event}</Text>
      )}

      {/* Description Input */}
      <TextInput
        style={styles.input}
        placeholder="Description"
        onChangeText={handleChange("description")}
        onBlur={handleBlur("description")}
        value={values.description}
      />
      {touched.description && errors.description && (
        <Text style={styles.error}>{errors.description}</Text>
      )}

      {/* Hall Selection Dropdown */}
      <View style={styles.dropdownContainer}>
        <RNPickerSelect
          placeholder={{ label: "Select Community Hall", value: null }}
          items={halls.map((hall) => ({
            label: hall.name,
            value: hall.hallId,
          }))}
          onValueChange={(value) => {
            setFieldValue("hallId", value);
            const selected = halls.find((hall) => hall.hallId === value);
            setSelectedHall(selected);
          }}
          value={values.hallId}
        />
      </View>
      {touched.hallId && errors.hallId && (
        <Text style={styles.error}>{errors.hallId}</Text>
      )}

      {/* Display Hall Details */}
      {selectedHall && (
        <>
          <Text style={styles.label}>Area: {selectedHall.area}</Text>
          <Text style={styles.label}>Terms: {selectedHall.terms}</Text>
          <Text style={styles.label}>
            Price Per Day: Rs. {selectedHall.pricePerDay}
          </Text>
        </>
      )}

      {/* Calendar for Date Selection */}
      <Calendar
        markedDates={{
          ...markedDates,
          ...(selectedDate && { [selectedDate]: { selected: true, selectedColor: "blue" } }),
        }}
        onDayPress={(day) => {
          if (!markedDates[day.dateString]?.disabled) {
            setSelectedDate(day.dateString);
          }
        }}
        minDate={new Date().toISOString().split("T")[0]}
      />

      {/* Declaration Box */}
      <View style={styles.declarationBox}>
        <Text style={styles.declaration}>
          By reserving this community hall, I agree to the terms and conditions:
          {"\n"}- No damage to property.{"\n"}- Follow all rules and regulations.
        </Text>
      </View>

      {/* Agreement Checkbox */}
      <TouchableOpacity
        style={styles.radioContainer}
        onPress={() => setFieldValue("agree", !values.agree)}
      >
        <View style={styles.radioButton}>
          {values.agree && <View style={styles.radioButtonInner} />}
        </View>
        <Text style={styles.radioText}>I Agree</Text>
      </TouchableOpacity>
      {touched.agree && errors.agree && (
        <Text style={styles.error}>{errors.agree}</Text>
      )}

      {/* Total Payment */}
      {totalPayment > 0 && (
        <Text style={styles.totalText}>
          Total Payment for selected date: Rs. {totalPayment}
        </Text>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          (!selectedDate || !selectedHall || !values.agree) && styles.disabledButton,
        ]}
        onPress={() => {
          if (!selectedDate) {
            Alert.alert("Date Missing", "Please select a valid date.");
            return;
          }
          formikRef.current.handleSubmit();
        }}
        disabled={!selectedDate || !selectedHall || !values.agree}
      >
        <Text style={styles.submitButtonText}>Submit Reservation</Text>
      </TouchableOpacity>

      {/* Payment Modal */}
      <PaymentGateway
        amount={totalPayment}
        visible={isPaymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        onPaymentSuccess={() => Alert.alert("Payment", "Payment successful")}
      />
    </View>
  );

  return (
    <FlatList
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <View>
          <Text style={styles.headerTitle}>Community Hall Reservation</Text>
          <Formik
            innerRef={formikRef}
            initialValues={{
              event: "",
              description: "",
              agree: false,
              hallId: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {renderFormContent}
          </Formik>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#F0F8FF",
  },
  dropdownContainer: {
    marginBottom: 15,
    backgroundColor: "#F0F8FF",
    borderRadius: 5,
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: '#333',
  },
  declarationBox: {
    padding: 10,
    backgroundColor: "#F0F8FF",
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  declaration: {
    fontSize: 14,
    color: '#333',
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "#F0F8FF",
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#000",
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  totalText: {
    marginTop: 20,
    marginBottom: 15,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: '#1a237e',
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontSize: 12,
  },
});

export default CommunityHallReservation;
