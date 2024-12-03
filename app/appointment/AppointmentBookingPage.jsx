import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useLocalSearchParams } from 'expo-router';

const AppointmentBookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const { serviceId, serviceTitle } = useLocalSearchParams();

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

      slots.push({
        time: `${displayHours}:${formattedMinutes} ${period}`,
        value: time
      });
    }

    return slots;
  }, []);

  // Disable dates before a specific future date
  const markedDates = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();
    
    const disabledDates = {};
    
    // Disable previous months and dates up to current month
    for (let year = today.getFullYear() - 1; year <= currentYear; year++) {
      const startMonth = year === currentYear ? 0 : currentMonth;
      const endMonth = year === currentYear ? currentMonth : 11;
      
      for (let month = startMonth; month <= endMonth; month++) {
        // Get the last day of the month
        const lastDay = new Date(year, month + 1, 0).getDate();
        
        for (let day = 1; day <= lastDay; day++) {
          // Condition to block dates
          if (year < currentYear || 
              month < currentMonth || 
              (month === currentMonth && day <= currentDate + 1)) {
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

  const handleBookAppointment = () => {
    // Implement booking logic
    console.log('Booking:', {
      service: serviceTitle,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      notes
    });
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
        <Text className="text-2xl font-bold text-blue-600 mb-4 mt-8">{serviceTitle}</Text>

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
            >
              {generateTimeSlots.map((slot) => (
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