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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
  monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};
LocaleConfig.defaultLocale = "en";

const validationSchema = Yup.object().shape({
  event: Yup.string().required("Event is required"),
  description: Yup.string().required("Description is required"),
  hallId: Yup.string().required("Hall selection is required"),
  agree: Yup.boolean().oneOf([true], "You must agree to the terms"),
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
  const router = useRouter();

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

  useEffect(() => {
    const today = new Date();
    const marked = {};
    for (let i = 0; i <= 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      marked[dateString] = { disabled: true, color: "gray" };
    }
    bookedDates.forEach(date => marked[date] = { disabled: true, color: "gray" });
    availableDates.forEach(date => !marked[date] && (marked[date] = { disabled: false, color: "green" }));
    setMarkedDates(marked);
  }, [bookedDates, availableDates]);

  useEffect(() => {
    setTotalPayment(selectedHall?.pricePerDay || 0);
  }, [selectedHall]);

  const handlePaymentSuccess = async () => {
    try {
      if (formikRef.current) {
        await formikRef.current.submitForm();
      }
      setPaymentModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Reservation failed after payment");
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    const payload = {
      ...values,
      userId,
      sabhaId,
      date: selectedDate,
      totalPayment,
      hallId: selectedHall.hallId,
    };

    try {
      await submitReservation(payload);
      Alert.alert("Success", "Reservation submitted!");
      resetForm();
      setSelectedDate(null);
      router.replace("/services");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const renderFormContent = ({ handleChange, handleBlur, setFieldValue, values, errors, touched }) => (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Event"
        onChangeText={handleChange("event")}
        onBlur={handleBlur("event")}
        value={values.event}
      />
      {touched.event && errors.event && <Text style={styles.error}>{errors.event}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Description"
        onChangeText={handleChange("description")}
        onBlur={handleBlur("description")}
        value={values.description}
      />
      {touched.description && errors.description && <Text style={styles.error}>{errors.description}</Text>}

      <View style={styles.dropdownContainer}>
        <RNPickerSelect
          placeholder={{ label: "Select Hall", value: null }}
          items={halls.map(hall => ({ label: hall.name, value: hall.hallId }))}
          onValueChange={value => {
            setFieldValue("hallId", value);
            setSelectedHall(halls.find(hall => hall.hallId === value));
          }}
          value={values.hallId}
        />
      </View>
      {touched.hallId && errors.hallId && <Text style={styles.error}>{errors.hallId}</Text>}

      {selectedHall && (
        <>
          <Text style={styles.label}>Area: {selectedHall.area}</Text>
          <Text style={styles.label}>Terms: {selectedHall.terms}</Text>
          <Text style={styles.label}>Price: Rs. {selectedHall.pricePerDay}/day</Text>
        </>
      )}

      <Calendar
        markedDates={{
          ...markedDates,
          ...(selectedDate && { [selectedDate]: { selected: true, selectedColor: "blue" } }),
        }}
        onDayPress={day => !markedDates[day.dateString]?.disabled && setSelectedDate(day.dateString)}
        minDate={new Date().toISOString().split("T")[0]}
      />

      <View style={styles.declarationBox}>
        <Text>By reserving, you agree to:{"\n"}- No property damage{"\n"}- Follow rules</Text>
      </View>

      <TouchableOpacity
        style={styles.radioContainer}
        onPress={() => setFieldValue("agree", !values.agree)}
      >
        <View style={styles.radioButton}>
          {values.agree && <View style={styles.radioButtonInner} />}
        </View>
        <Text style={styles.radioText}>I Agree</Text>
      </TouchableOpacity>
      {touched.agree && errors.agree && <Text style={styles.error}>{errors.agree}</Text>}

      <TouchableOpacity
        style={[styles.submitButton, (!selectedDate || !values.agree) && styles.disabledButton]}
        onPress={() => {
          if (!selectedDate) {
            Alert.alert("Error", "Select a date first");
            return;
          }
          setPaymentModalVisible(true);
        }}
        disabled={!selectedDate || !values.agree}
      >
        <Text style={styles.submitButtonText}>Proceed to Payment (Rs. {totalPayment})</Text>
      </TouchableOpacity>

      <PaymentGateway
        visible={isPaymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        onPaymentSuccess={handlePaymentSuccess}
        totalPayment={totalPayment}
      />
    </View>
  );

  return (
    <FlatList
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Community Hall Reservation</Text>
          <Formik
            innerRef={formikRef}
            initialValues={{ event: "", description: "", hallId: "", agree: false }}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {renderFormContent}
          </Formik>
        </>
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
