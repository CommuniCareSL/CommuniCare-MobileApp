import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Calendar, LocaleConfig } from "react-native-calendars";
import * as SecureStore from "expo-secure-store";
import { fetchGroundsBySabhaId } from "../../../services/reservations/groundService";
import { fetchBookedDatesByGroundId } from "../../../services/reservations/groundService";
import RNPickerSelect from "react-native-picker-select";

// Configure locale for the calendar
LocaleConfig.locales["en"] = {
  monthNames: [
    "January","February","March","April","May","June","July","August","September","October","November","December",],
  monthNamesShort: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",],
  dayNames: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday",],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};
LocaleConfig.defaultLocale = "en";

// Validation schema for the form
const validationSchema = Yup.object().shape({
  event: Yup.string().required("Event is required"),
  description: Yup.string().required("Description is required"),
  groundId: Yup.string().required("Ground selection is required"),
  agree: Yup.boolean().oneOf(
    [true],
    "You must agree to the terms and conditions"
  ),
});

const PlaygroundReservation = () => {
  const [selectedDates, setSelectedDates] = useState([]); // Array of selected dates
  const [userId, setUserId] = useState(null);
  const [sabhaId, setSabhaId] = useState(null);
  const [grounds, setGrounds] = useState([]);
  const [selectedGround, setSelectedGround] = useState(null);
  const [bookedDates, setBookedDates] = useState([]); // Array of booked dates
  const [availableDates, setAvailableDates] = useState([]); // Array of available dates
  const [totalPayment, setTotalPayment] = useState(0); // Total payment state
  const [markedDates, setMarkedDates] = useState({}); // Marked dates for the calendar

  // Fetch user details (userId and sabhaId) from secure storage
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedUserDetails = await SecureStore.getItemAsync("userDetails");
        if (storedUserDetails) {
          const { userId, sabhaId } = JSON.parse(storedUserDetails);
          setUserId(userId);
          setSabhaId(sabhaId);

          // Fetch grounds using sabhaId
          const groundsData = await fetchGroundsBySabhaId(sabhaId);
          setGrounds(groundsData);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  // Fetch booked dates when a ground is selected
  useEffect(() => {
    if (selectedGround) {
      const fetchBookedDates = async () => {
        try {
          const bookedDatesData = await fetchBookedDatesByGroundId(
            selectedGround.groundId
          );
          setBookedDates(bookedDatesData);
        } catch (error) {
          console.error("Failed to fetch booked dates:", error);
        }
      };

      fetchBookedDates();
    }
  }, [selectedGround]);

  // Generate available dates (after the next 6 days)
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

  // Update marked dates when bookedDates or availableDates change
  useEffect(() => {
    const today = new Date();
    const next6Days = new Date(today);
    next6Days.setDate(today.getDate() + 6);

    const marked = {};

    // Mark today and the next 6 days as disabled
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

    // Mark booked dates as disabled
    bookedDates.forEach((date) => {
      marked[date] = { disabled: true, disableTouchEvent: true, color: "gray" };
    });

    // Mark available dates as selectable
    availableDates.forEach((date) => {
      if (!marked[date]) {
        marked[date] = { disabled: false, color: "green" };
      }
    });

    setMarkedDates(marked);
  }, [bookedDates, availableDates]);

  // Handle date selection
  const handleDateSelection = (date) => {
    const dateString = date.dateString;
    if (selectedDates.includes(dateString)) {
      // Remove date if already selected
      setSelectedDates(selectedDates.filter((d) => d !== dateString));
    } else {
      // Add date if not selected
      setSelectedDates([...selectedDates, dateString]);
    }
  };

  // Calculate total payment whenever selected dates or selected ground changes
  useEffect(() => {
    if (selectedGround && selectedDates.length > 0) {
      const total = selectedDates.length * selectedGround.pricePerDay;
      setTotalPayment(total);
    } else {
      setTotalPayment(0); // Reset total payment if no dates are selected
    }
  }, [selectedDates, selectedGround]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Playground Reservation</Text>

        <Formik
          initialValues={{
            event: "",
            description: "",
            groundId: "",
            agree: false,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            // Prepare payload for backend
            const payload = {
              ...values,
              userId,
              sabhaId,
              reservationId: 1,
              dates: selectedDates, // Include selected dates
              totalPayment, // Include total payment
            };

            // Log the payload to the console
            console.log("Data sent to backend:", payload);

            try {
              // Submit reservation to backend
              await submitReservation(payload);
              alert("Reservation submitted successfully");
              resetForm();
              setSelectedDates([]); // Clear selected dates
              setTotalPayment(0); // Reset total payment
            } catch (error) {
              console.error("Reservation submission failed:", error);
              alert("Failed to submit reservation");
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

              {/* Ground Selection Dropdown */}
              <View style={styles.dropdownContainer}>
                <RNPickerSelect
                  placeholder={{ label: "Select Ground", value: null }}
                  items={grounds.map((ground) => ({
                    label: ground.name,
                    value: ground.groundId,
                  }))}
                  onValueChange={(value) => {
                    setFieldValue("groundId", value);
                    const selected = grounds.find(
                      (ground) => ground.groundId === value
                    );
                    setSelectedGround(selected);
                  }}
                  value={values.groundId}
                />
              </View>
              {touched.groundId && errors.groundId && (
                <Text style={styles.error}>{errors.groundId}</Text>
              )}

              {/* Display Area and Terms */}
              {selectedGround && (
                <>
                  <Text style={styles.label}>Area: {selectedGround.area}</Text>
                  <Text style={styles.label}>
                    Terms: {selectedGround.terms}
                  </Text>
                  <Text style={styles.label}>
                    Price Per Day: Rs. {selectedGround.pricePerDay}
                  </Text>
                </>
              )}

              {/* Calendar for Date Selection */}
              <Calendar
                markedDates={{
                  ...markedDates,
                  ...selectedDates.reduce((acc, date) => {
                    acc[date] = { selected: true, selectedColor: "blue" };
                    return acc;
                  }, {}),
                }}
                onDayPress={(day) => {
                  if (!markedDates[day.dateString]?.disabled) {
                    handleDateSelection(day);
                  }
                }}
                minDate={new Date().toISOString().split("T")[0]}
              />

              {/* Declaration Box */}
              <View style={styles.declarationBox}>
                <Text style={styles.declaration}>
                  By reserving this playground, I agree to the terms and
                  conditions:
                  {"\n"}- No damage to property.{"\n"}- Follow all rules and
                  regulations.
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

              {/* Display Selected Dates */}
              {values.agree && selectedDates.length > 0 && (
                <View style={styles.selectedDatesContainer}>
                  <Text style={styles.label}>Selected Dates:</Text>
                  <FlatList
                    data={selectedDates}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <Text style={styles.selectedDate}>{item}</Text>
                    )}
                  />
                  {/* Display Total Payment */}
                  <Text style={styles.label}>
                    Total Payment: Rs. {totalPayment}
                  </Text>
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !values.agree && { backgroundColor: "#ccc" },
                ]}
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
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#F0F8FF",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#F0F8FF",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  selectedDatesContainer: {
    marginTop: 10,
  },
  selectedDate: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#28a745",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#28a745",
  },
  radioText: {
    fontSize: 16,
    color: "#555",
  },
  declarationBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 15,
    backgroundColor: "#F0F8FF",
    marginVertical: 10,
  },
  declaration: {
    fontSize: 14,
    color: "#555",
  },
  submitButton: {
    backgroundColor: "#ffc107",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
});

export default PlaygroundReservation;
