import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

const ReservationStatus = () => {
  const router = useRouter();
  const [records] = useState({
    reservations: [
      { reservationTypeName: 'Playground', date: '2023-11-25', status: 'Approved' },
      { reservationTypeName: 'Community Hall', date: '2023-11-30', status: 'Pending' },
      { reservationTypeName: 'Sports Facility', date: '2023-12-02', status: 'Rejected' },
      { reservationTypeName: 'Swimming Pool', date: '2023-12-05', status: 'Pending' },
      { reservationTypeName: 'Park Pavilion', date: '2023-12-10', status: 'Approved' }
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
            onPress={() => router.push('/services/reservations/status')}
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
            title="Reservations"
            data={records.reservations}
            fields={[
              { label: 'Reservation Type', key: 'reservationTypeName' },
              { label: 'Date', key: 'date' }
            ]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReservationStatus;