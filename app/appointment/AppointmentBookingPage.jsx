import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useLocalSearchParams, useRouter } from 'expo-router';import { getUserDetails } from "../../hooks/storage";
import AppointmentService from '../../services/AppointmentService'; // Update path as needed

const AppointmentBookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const { serviceId, serviceTitle } = useLocalSearchParams();
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch userId when the page loads
    const fetchUserId = async () => {
      try {
        const userDetails = await getUserDetails();
        if (userDetails) {
          setUserId(userDetails.userId);
        } else {
          console.log("No user details found");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  // Check availability when a date is selected
  useEffect(() => {
    const checkAvailability = async () => {
      if (selectedDate && serviceId) {
        try {
          const slots = await AppointmentService.checkTimeSlotAvailability(
            serviceId, 
            selectedDate
          );
          setBookedSlots(slots);
        } catch (error) {
          console.error('Failed to check availability:', error);
          Alert.alert('Error', 'Could not check time slot availability');
        }
      }
    };

    checkAvailability();
  }, [selectedDate, serviceId]);

  // Generate time slots in 20-minute intervals
  const generateTimeSlots = useMemo(() => {
    const slots = [];
    const startTime = 8.5; // 8:30 AM
    const endTime = 16; // 4:00 PM

    for (let time = startTime; time < endTime; time += 1/3) {
      // Skip 12:00-1:00 PM
      if (time >= 12 && time < 13) continue;

      const hours = Math.floor(time);
      const minutes = Math.round((time % 1) * 60);
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);

      const slotTime = `${displayHours}:${formattedMinutes} ${period}`;

      // Check if slot is already booked
      const isBooked = bookedSlots.includes(time);

      slots.push({
        time: slotTime,
        value: time,
        isBooked: isBooked
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
          
          // Block conditions:
          // 1. Weekend days
          // 2. Dates before current date
          const shouldDisable = 
            isWeekend(currentDate) || 
            (year < today.getFullYear() || 
             (year === today.getFullYear() && 
              (month < today.getMonth() || 
               (month === today.getMonth() && day < today.getDate() + 2))));
          
          if (shouldDisable) {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            disabledDates[dateString] = { 
              disabled: true, 
              disableTouchEvent: true,
              color: '#CCCCCC',
              textColor: '#888888'
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
        selectedColor: '#007BFF'
      };
    }
  
    return disabledDates;
  }, [selectedDate]);

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  // const handleBookAppointment = () => {
  //   // Implement booking logic
  //   console.log('Booking:', {
  //     service: serviceTitle,
  //     date: selectedDate,
  //     timeSlot: selectedTimeSlot,
  //     notes
  //   });
  // };

  const handleBookAppointment = async () => {
    if (!userId || !serviceId || !selectedDate || !selectedTimeSlot) {
      Alert.alert('Error', 'Please complete all booking details');
      return;
    }

    try {
      const bookingData = {
        userId,
        serviceId,
        date: selectedDate,
        timeSlot: selectedTimeSlot.value,
        notes: notes || ''
      };

      const response = await AppointmentService.bookAppointment(bookingData);
      
      Alert.alert('Success', 'Appointment booked successfully!', [
        {
          text: 'OK', 
          onPress: () => router.push('/appointments')
        }
      ]);
    } catch (error) {
      console.error('Booking failed:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    }
  };

  // Modify time slot rendering to show booked status
  const renderTimeSlots = () => {
    const screenWidth = Dimensions.get('window').width;
    const slotWidth = screenWidth < 375 ? 100 : 120;

    return generateTimeSlots.map((slot) => (
      <TouchableOpacity
        key={slot.time}
        style={{ 
          width: slotWidth, 
          marginBottom: 8 
        }}
        className={`
          p-2 rounded-lg border
          ${slot.isBooked 
            ? 'bg-gray-300 border-gray-300' // Booked slots are grayed out
            : (selectedTimeSlot?.time === slot.time 
              ? 'bg-blue-600 border-blue-600' 
              : 'border-blue-300 bg-white')
        }`}
        disabled={slot.isBooked}
        onPress={() => !slot.isBooked && handleTimeSlotSelect(slot)}
      >
        <Text 
          className={`
            text-center
            ${slot.isBooked 
              ? 'text-gray-500' 
              : (selectedTimeSlot?.time === slot.time 
                ? 'text-white' 
                : 'text-blue-600')
            }
          `}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {slot.time} {slot.isBooked ? '(Booked)' : ''}
        </Text>
      </TouchableOpacity>
    ));
  };


  // Responsive layout
  const screenWidth = Dimensions.get('window').width;
  const slotWidth = screenWidth < 375 ? 100 : 120; // Adjust slot width based on screen size

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        className="p-4"
        contentContainerStyle={{ 
          flexGrow: 1, 
          paddingBottom: 20 
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Service Name */}
        <Text className="text-xl font-medium text-blue-600 mb-2 mt-8">{serviceTitle}</Text>

        {/* Calendar */}
        <View className="mb-4">
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

        {/* Time Slots */}
        {selectedDate && (
          <View className="mb-4">
            <Text className="text-lg font-semibold text-blue-600 mb-2">Select Time Slot</Text>
            <View 
              className="flex-row flex-wrap"
              style={{ 
                justifyContent: 'flex-start',
                gap: 8 
              }}
            > {renderTimeSlots()}
              {/* {generateTimeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.time}
                  style={{ 
                    width: slotWidth, 
                    marginBottom: 8 
                  }}
                  className={`
                    p-2 rounded-lg border
                    ${selectedTimeSlot?.time === slot.time 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'border-blue-300 bg-white'}
                  `}
                  onPress={() => handleTimeSlotSelect(slot)}
                >
                  <Text 
                    className={`
                      text-center
                      ${selectedTimeSlot?.time === slot.time 
                        ? 'text-white' 
                        : 'text-blue-600'}
                    `}
                    adjustsFontSizeToFit
                    numberOfLines={1}
                  >
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))} */}
            </View>
          </View>
        )}

        {/* Notes */}
        {selectedTimeSlot && (
          <View className="mb-4">
            <Text className="text-lg font-semibold text-blue-600 mb-2">Additional Notes</Text>
            <TextInput
              className="border border-blue-300 rounded-lg p-2 h-20"
              multiline
              placeholder="Add any additional notes (optional)"
              value={notes}
              onChangeText={setNotes}
              textAlignVertical="top"
            />
          </View>
        )}

        {/* Book Appointment Button */}
        {selectedTimeSlot && (
          <TouchableOpacity
            className="bg-blue-600 p-3 rounded-lg"
            onPress={handleBookAppointment}
          >
            <Text className="text-white text-center font-bold">
              Book Appointment
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppointmentBookingPage;