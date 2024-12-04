import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; // Ensure expo-router is installed and configured

const Records = () => {
  const router = useRouter(); // Access the router instance
  const [records] = useState({
    complaints: [
      { complaintType: 'Noise Pollution', sabhaName: 'City Sabha', status: 'In Progress' },
      { complaintType: 'Road Damage', sabhaName: 'Suburban Sabha', status: 'Completed' },
      { complaintType: 'Water Leakage', sabhaName: 'Urban Sabha', status: 'Pending' }
    ],
    reservations: [
      { reservationTypeName: 'Playground', date: '2023-11-25', status: 'Approved' },
      { reservationTypeName: 'Community Hall', date: '2023-11-30', status: 'Pending' },
      { reservationTypeName: 'Sports Facility', date: '2023-12-02', status: 'Rejected' }
    ],
    appointments: [
      { serviceName: 'Health Checkup', date: '2023-12-01', time: '10:30 AM', status: 'Scheduled' },
      { serviceName: 'Permit Renewal', date: '2023-12-03', time: '2:00 PM', status: 'Completed' },
      { serviceName: 'Consultation', date: '2023-12-05', time: '1:00 PM', status: 'Pending' }
    ]
  });

  const sortRecords = (data) => {
    return data.sort((a, b) => {
      if (a.status === 'Pending') return -1;
      if (b.status === 'Pending') return 1;
      return 0;
    });
  };

  const DetailSection = ({ title, data, fields }) => {
    const sortedData = sortRecords(data);
    return (
      <View className="border border-blue-200 rounded-lg p-4 mb-4 shadow-sm bg-white">
        <Text className="text-xl font-bold text-blue-800 mb-3">{title}</Text>
        {sortedData.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            className="flex-row justify-between items-center mb-2 border-b border-gray-200 pb-2"
            onPress={() => router.push('/services/reservations/status')} // Dynamic navigation
          >
            <View>
              {fields.map((field, idx) => (
                <Text key={idx} className="text-sm text-gray-700">
                  <Text className="font-semibold">{field.label}: </Text>
                  {item[field.key]}
                </Text>
              ))}
            </View>
            <Text className="text-sm font-bold text-blue-600">{item.status}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        <View className="border border-gray-300 rounded-lg shadow-md p-4">
          <DetailSection
            title="Complaints"
            data={records.complaints}
            fields={[
              { label: 'Type', key: 'complaintType' },
              { label: 'Sabha Name', key: 'sabhaName' }
            ]}
          />
          <DetailSection
            title="Reservations"
            data={records.reservations}
            fields={[
              { label: 'Reservation Type', key: 'reservationTypeName' },
              { label: 'Date', key: 'date' }
            ]}
          />
          <DetailSection
            title="Appointments"
            data={records.appointments}
            fields={[
              { label: 'Service Name', key: 'serviceName' },
              { label: 'Date', key: 'date' },
              { label: 'Time', key: 'time' }
            ]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Records;


