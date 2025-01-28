import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { getUserDetails } from "../../../../hooks/storage";
import { fetchUserAppointments } from '../../../../services/status/appointmentstatusService';

const AppointmentStatus = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const statusMap = {
    0: { text: 'Booked', color: 'bg-blue-100 text-blue-700' },
    1: { text: 'Cancelled', color: 'bg-red-100 text-red-700' },
    2: { text: 'Ongoing', color: 'bg-orange-100 text-orange-700' },
    3: { text: 'Completed', color: 'bg-green-100 text-green-700' }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userDetails = await getUserDetails();
        if (userDetails) setUserId(userDetails.userId);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const loadAppointments = async () => {
      if (userId) {
        try {
          const data = await fetchUserAppointments(userId);
          setAppointments(data);
        } catch (error) {
          console.error('Error loading appointments:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadAppointments();
  }, [userId]);

  const DetailSection = ({ title, data }) => {
    if (loading) {
      return (
        <View className="py-4">
          <Text className="text-gray-500 text-center">Loading appointments...</Text>
        </View>
      );
    }

    if (!data || data.length === 0) {
      return (
        <View className="py-4">
          <Text className="text-gray-500 text-center">No appointments found</Text>
        </View>
      );
    }

    return (
      <View className="border border-blue-200 rounded-lg p-4 mb-4 shadow-sm bg-white">
        <Text className="text-xl font-bold text-blue-800 mb-4">{title}</Text>
        {data.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            className="flex-row justify-between items-start py-3 border-b border-gray-200 last:border-b-0"
            onPress={() => setSelectedAppointment(item)}
          >
            <View className="flex-1 pr-4">
              <Text className="text-sm font-medium text-gray-800 mb-1">
                {item.title}
              </Text>
              <Text className="text-sm text-gray-600">
                {formatDate(item.date)} - {item.timeSlot}
              </Text>
            </View>

            <View className="justify-center">
              <Text className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusMap[item.status].color}`}>
                {statusMap[item.status].text}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        contentContainerStyle={{ padding: 16 }} 
        showsVerticalScrollIndicator={false}
      >
        <View className="border border-gray-200 rounded-lg shadow-sm p-4 bg-gray-50">
          <DetailSection
            title="My Appointments"
            data={appointments}
          />
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={!!selectedAppointment}
        onRequestClose={() => setSelectedAppointment(null)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 p-6 rounded-lg">
            <Text className="text-xl font-bold text-blue-800 mb-6">Appointment Details</Text>
            
            <View className="space-y-4 mb-4">
              <DetailRow label="Service" value={selectedAppointment?.title} />
              <DetailRow label="Sabha" value={selectedAppointment?.sabha?.sabhaName} />
              <DetailRow label="Department" value={selectedAppointment?.department?.departmentName} />
              <DetailRow label="Date" value={formatDate(selectedAppointment?.date)} />
              <DetailRow label="Time Slot" value={selectedAppointment?.timeSlot} />
              <DetailRow 
                label="Status" 
                value={statusMap[selectedAppointment?.status]?.text} 
                status={statusMap[selectedAppointment?.status]?.text.toLowerCase()} 
              />
              <DetailRow label="Notes" value={selectedAppointment?.note || 'No notes'} />
              <DetailRow label="Created At" value={formatDate(selectedAppointment?.createdAt)} />
            </View>

            <TouchableOpacity
              className="bg-blue-500 py-3 px-6 rounded-lg self-center mt-4"
              onPress={() => setSelectedAppointment(null)}
            >
              <Text className="text-white font-medium">Close Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const DetailRow = ({ label, value, status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'booked': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'ongoing': return 'bg-orange-100 text-orange-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <View className="flex-col space-y-1">
      <Text className="text-sm font-semibold text-gray-700">{label}</Text>
      {status ? (
        <View className={`self-start px-3 py-1 rounded-full ${getStatusStyle()}`}>
          <Text className="text-xs font-semibold">{value}</Text>
        </View>
      ) : (
        <Text className="text-sm text-gray-600">{value || 'N/A'}</Text>
      )}
    </View>
  );
};

export default AppointmentStatus;