import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const Records = () => {
  const [complaintsInProgress, setComplaintsInProgress] = React.useState(10);
  const [complaintsComplete, setComplaintsComplete] = React.useState(5);
  const [servicesInProgress, setServicesInProgress] = React.useState(8);
  const [servicesComplete, setServicesComplete] = React.useState(3);
  const [approveAppointment, setApproveAppointment] = React.useState(2);
  const [completeAppointment, setCompleteAppointment] = React.useState(1);

  const RecordBox = ({ title, items, className }) => (
    <View className={`bg-blue-50 rounded-xl p-4 mb-4 shadow-md ${className}`}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-blue-800">{title}</Text>
        <Image
          source={require('../../assets/images/logo.jpg')}
          className="w-12 h-12 rounded-full"
        />
      </View>
      <View className="flex-row flex-wrap justify-between">
        {items.map((item, index) => (
          <TouchableOpacity key={index} className="items-center w-[48%] mb-4">
            <Ionicons name={item.icon} size={24} color="#4A90E2" />
            <Text className="text-sm font-semibold text-gray-800 mt-2 text-center">{item.title}</Text>
            <Text className="text-2xl font-bold text-blue-600">{item.count}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-6">
        <RecordBox
          title="Services"
          items={[
            { title: "In Progress", count: servicesInProgress, icon: "construct-outline" },
            { title: "Completed", count: servicesComplete, icon: "checkmark-done-circle" },
          ]}
          className="mb-6"
        />
        <RecordBox
          title="Complaints"
          items={[
            { title: "In Progress", count: complaintsInProgress, icon: "time-outline" },
            { title: "Completed", count: complaintsComplete, icon: "checkmark-circle" },
          ]}
          className="mb-6"
        />
        <RecordBox
          title="Appointments"
          items={[
            { title: "Approve", count: approveAppointment, icon: "calendar" },
            { title: "Complete", count: completeAppointment, icon: "flag" },
          ]}
        />
      </View>
    </SafeAreaView>
  );
};

export default Records;