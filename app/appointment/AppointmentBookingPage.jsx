import React, { useState, useMemo, useEffect } from "react";
import {
  View,Text,TextInput,TouchableOpacity,ScrollView,SafeAreaView,Dimensions,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import AppointmentService from "../../services/apppointment/appointmentService"; // Update path as needed

const AppointmentBookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [notes, setNotes] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [holidayDates, setHolidayDates] = useState([]); // State to store holiday dates
  const { serviceId, serviceTitle, departmentId } = useLocalSearchParams();
  const [userId, setUserId] = useState(null);
  const [sabhaId, setSabhaId] = useState(null);
  const router = useRouter();

  // Fetch holiday dates when the component mounts
  useEffect(() => {
    const fetchHolidayDates = async () => {
      try {
        const holidays = await AppointmentService.getHolidayDates();
        setHolidayDates(holidays);
      } catch (error) {
        console.error("Failed to fetch holiday dates:", error);
        Alert.alert(
          "Error",
          "Failed to fetch holiday dates. Please try again later."
        );
      }
    };

    fetchHolidayDates();
  }, []);

  // Fetch user details
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
      }
    };

    fetchUserDetails();
  }, []);

  // Check availability when a date is selected
  useEffect(() => {
    const checkAvailability = async () => {
      if (selectedDate && departmentId && sabhaId) {
        try {
          const slots = await AppointmentService.checkTimeSlotAvailability(
            sabhaId, 
            departmentId, 
            selectedDate 
          );
          setBookedSlots(slots);
        } catch (error) {
          console.error("Failed to check availability:", error);
          Alert.alert("Error", "Could not check time slot availability");
        }
      }
    };

    checkAvailability();
  }, [selectedDate, departmentId, sabhaId]);

  // Generate time slots in 15-minute intervals
  const generateTimeSlots = useMemo(() => {
    const slots = [];
    const startTime = 8.5; // 8:30 AM
    const endTime = 16; // 4:00 PM

    for (let time = startTime; time < endTime; time += 0.25) {
      // Increment by 0.25 (15 minutes)
      // Skip 12:00-1:00 PM
      if (time >= 12 && time < 13) continue;

      const hours = Math.floor(time);
      const minutes = Math.round((time % 1) * 60);
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;

      const slotTime = `${displayHours}:${formattedMinutes} ${period}`;

      // Check if slot is already booked
      const isBooked = bookedSlots.includes(time);

      slots.push({
        time: slotTime,
        value: time,
        isBooked: isBooked,
      });
    }

    return slots;
  }, [bookedSlots]);

  // Disable dates before a specific future date
  const markedDates = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();

    const disabledDates = {};

    // Function to check if a date is a weekend (Saturday or Sunday)
    const isWeekend = (date) => {
      const day = date.getDay();
      return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
    };

    // Generate disabled dates
    for (let year = today.getFullYear() - 1; year <= currentYear + 1; year++) {
      for (let month = 0; month <= 11; month++) {
        // Get the last day of the month
        const lastDay = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= lastDay; day++) {
          const currentDate = new Date(year, month, day);
          const dateString = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;

          // Block conditions:
          // 1. Weekend days
          // 2. Dates before current date
          // 3. Holiday dates
          const shouldDisable =
            isWeekend(currentDate) ||
            year < today.getFullYear() ||
            (year === today.getFullYear() &&
              (month < today.getMonth() ||
                (month === today.getMonth() && day < today.getDate() + 3))) ||
            holidayDates.includes(dateString);

          if (shouldDisable) {
            disabledDates[dateString] = {
              disabled: true,
              disableTouchEvent: true,
              color: "#CCCCCC",
              textColor: "#888888",
            };
          }
        }
      }
    }

    // Highlight selected date
    if (selectedDate) {
      disabledDates[selectedDate] = {
        ...disabledDates[selectedDate],
        selected: true,
        selectedColor: "#007BFF",
      };
    }

    return disabledDates;
  }, [selectedDate, holidayDates]);

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const handleBookAppointment = async () => {
    if (!userId || !departmentId || !selectedDate || !selectedTimeSlot) {
      Alert.alert("Error", "Please complete all booking details");
      return;
    }

    try {
      const bookingData = {
        userId,
        sabhaId, // Include sabhaId
        serviceId, // Include serviceId
        serviceTitle,
        departmentId,
        date: selectedDate,
        timeSlot: selectedTimeSlot.time, // Use the formatted time (e.g., "08:30 AM")
        notes: notes || "",
      };

      // Send booking data to the backend
      const response = await AppointmentService.bookAppointment(bookingData);

      Alert.alert("Success", "Appointment booked successfully!", [
        {
          text: "OK",
          onPress: () => router.push("/services"),
        },
      ]);
    } catch (error) {
      console.error("Booking failed:", error);
      Alert.alert("Error", "Failed to book appointment. Please try again.");
    }
  };

  // Modify time slot rendering to show booked status
  const renderTimeSlots = () => {
    const screenWidth = Dimensions.get("window").width;
    const slotWidth = screenWidth < 375 ? 100 : 120;

    return generateTimeSlots.map((slot) => (
      <TouchableOpacity
        key={slot.time}
        style={{
          width: slotWidth,
          marginBottom: 8,
        }}
        className={`
          p-2 rounded-lg border
          ${
            slot.isBooked
              ? "bg-gray-300 border-gray-300" // Booked slots are grayed out
              : selectedTimeSlot?.time === slot.time
              ? "bg-blue-600 border-blue-600"
              : "border-blue-300 bg-white"
          }`}
        disabled={slot.isBooked}
        onPress={() => !slot.isBooked && handleTimeSlotSelect(slot)}
      >
        <Text
          className={`
            text-center
            ${
              slot.isBooked
                ? "text-gray-500"
                : selectedTimeSlot?.time === slot.time
                ? "text-white"
                : "text-blue-600"
            }
          `}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {slot.time} {slot.isBooked ? "(Booked)" : ""}
        </Text>
      </TouchableOpacity>
    ));
  };

  // Responsive layout
  const screenWidth = Dimensions.get("window").width;
  const slotWidth = screenWidth < 375 ? 100 : 120; // Adjust slot width based on screen size

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView 
        style={{ padding: 16 }}
        contentContainerStyle={{ 
          flexGrow: 1, 
          paddingBottom: 20 
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: '500', 
            color: '#2563eb', 
            marginBottom: 8, 
            marginTop: 32 
          }}>
            {serviceTitle}
          </Text>
        </View>
  
        <View style={{ marginBottom: 16 }}>
          <Calendar
            markedDates={markedDates}
            onDayPress={handleDateSelect}
            theme={{
              selectedDayBackgroundColor: '#007BFF',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#007BFF',
              arrowColor: '#007BFF'
            }}
          />
        </View>
  
        {selectedDate && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '600', 
              color: '#2563eb', 
              marginBottom: 8 
            }}>
              Select Time Slot
            </Text>
            <View 
              style={{ 
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                gap: 8 
              }}
            >
              {renderTimeSlots()}
            </View>
          </View>
        )}
  
        {selectedTimeSlot && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '600', 
              color: '#2563eb', 
              marginBottom: 8 
            }}>
              Additional Notes
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#93c5fd',
                borderRadius: 8,
                padding: 8,
                height: 80,
              }}
              multiline
              placeholder="Add any additional notes (optional)"
              value={notes}
              onChangeText={setNotes}
              textAlignVertical="top"
            />
          </View>
        )}
  
        {selectedTimeSlot && (
          <TouchableOpacity
            style={{
              backgroundColor: '#2563eb',
              padding: 12,
              borderRadius: 8,
            }}
            onPress={handleBookAppointment}
          >
            <Text style={{ 
              color: 'white', 
              textAlign: 'center', 
              fontWeight: 'bold' 
            }}>
              Book Appointment
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppointmentBookingPage;
