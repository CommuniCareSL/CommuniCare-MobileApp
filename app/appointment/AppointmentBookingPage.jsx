import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useLocalSearchParams } from 'expo-router';

const AppointmentBookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const { serviceId, serviceTitle } = useLocalSearchParams();
  //console.log(serviceId, serviceTitle);

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    const startTime = 8.5; // 8:30 AM
    const endTime = 16; // 4:00 PM

    for (let time = startTime; time < endTime; time += 0.5) {
      // Skip 12:00-1:00 PM
      if (time >= 12 && time < 13) continue;

      const hours = Math.floor(time);
      const minutes = time % 1 === 0 ? '00' : '30';
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);

      slots.push({
        time: `${displayHours}:${minutes} ${period}`,
        value: time
      });
    }

    return slots;
  };

  // Disable dates before today and today
  const markedDates = () => {
    const today = new Date();
    const disabledDates = {};
    
    for (let d = new Date(today.getFullYear(), today.getMonth(), 1); 
         d < today; 
         d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      disabledDates[dateString] = { 
        disabled: true, 
        disableTouchEvent: true,
        color: '#CCCCCC',
        textColor: '#888888'
      };
    }

    // Disable today
    const todayString = today.toISOString().split('T')[0];
    disabledDates[todayString] = { 
      disabled: true, 
      disableTouchEvent: true,
      color: '#CCCCCC',
      textColor: '#888888'
    };

    // Highlight selected date
    if (selectedDate) {
      disabledDates[selectedDate] = { 
        ...disabledDates[selectedDate],
        selected: true, 
        selectedColor: '#007BFF'
      };
    }

    return disabledDates;
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const handleBookAppointment = () => {
    // Implement booking logic
    console.log('Booking:', {
      service: serviceTitle,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      notes
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        {/* Service Name */}
        <Text className="text-2xl font-bold text-blue-600 mb-4">{serviceTitle}</Text>

        {/* Calendar */}
        <View className="mb-4">
          <Calendar
            markedDates={markedDates()}
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
            <View className="flex-row flex-wrap">
              {generateTimeSlots().map((slot) => (
                <TouchableOpacity
                  key={slot.time}
                  className={`
                    p-2 m-1 rounded-lg border
                    ${selectedTimeSlot?.time === slot.time 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'border-blue-300 bg-white'}
                  `}
                  onPress={() => handleTimeSlotSelect(slot)}
                >
                  <Text className={`
                    text-center
                    ${selectedTimeSlot?.time === slot.time 
                      ? 'text-white' 
                      : 'text-blue-600'}
                  `}>
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
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