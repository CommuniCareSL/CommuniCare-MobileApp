import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { getUserDetails } from "../../../../hooks/storage";
import { fetchUserComplaints } from '../../../../services/status/complaintstatusService';

const ComplaintStatus = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const [date, time] = isoString.split('T');
    return `${date} ${time.substring(0, 5)}`;
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userDetails = await getUserDetails();
        if (userDetails) {
          setUserId(userDetails.userId);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const loadComplaints = async () => {
      if (userId) {
        try {
          const data = await fetchUserComplaints(userId);
          setComplaints(data);
        } catch (error) {
          console.error('Error loading complaints:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadComplaints();
  }, [userId]);

  const handleCloseModal = () => {
    setSelectedComplaint(null);
  };

  const DetailSection = ({ title, data }) => {
    if (loading) {
      return (
        <View className="py-4">
          <Text className="text-gray-500 text-center">Loading complaints...</Text>
        </View>
      );
    }

    if (!data || data.length === 0) {
      return (
        <View className="py-4">
          <Text className="text-gray-500 text-center">No complaints found</Text>
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
            onPress={() => setSelectedComplaint(item)}
          >
            <View className="flex-1 pr-4">
              <View className="mb-1.5">
                <Text className="text-sm font-medium text-gray-800">
                  Type: <Text className="font-normal text-gray-600">{item.type}</Text>
                </Text>
              </View>
              <View>
                <Text className="text-sm font-medium text-gray-800">
                  Sabha: <Text className="font-normal text-gray-600">{item.sabhaName}</Text>
                </Text>
              </View>
            </View>

            <View className="justify-center">
              <Text className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                item.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                item.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                item.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {item.status}
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
            title="My Complaints"
            data={complaints}
          />
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={!!selectedComplaint}
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 p-6 rounded-lg">
            <Text className="text-xl font-bold text-blue-800 mb-6">Complaint Details</Text>
            
            <View className="space-y-4 mb-4">
              <DetailRow label="Complaint ID" value={selectedComplaint?.id} />
              <DetailRow label="Type" value={selectedComplaint?.type} />
              <DetailRow label="Sabha" value={selectedComplaint?.sabhaName} />
              <DetailRow 
                label="Status" 
                value={selectedComplaint?.status} 
                status={selectedComplaint?.status?.toLowerCase()} 
              />
              <DetailRow 
                label="Description" 
                value={selectedComplaint?.description || 'No description provided'} 
              />
              <DetailRow label="Created Date" value={formatDateTime(selectedComplaint?.createdAt)} />
              <DetailRow label="Last Updated" value={formatDateTime(selectedComplaint?.updatedAt)} />
            </View>

            <TouchableOpacity
              className="bg-blue-500 py-3 px-6 rounded-lg self-center mt-4"
              onPress={handleCloseModal}
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
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'ongoing': return 'bg-blue-100 text-blue-700';
      case 'resolved': return 'bg-green-100 text-green-700';
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
        <Text className="text-sm text-gray-600">
          {value || 'N/A'}
        </Text>
      )}
    </View>
  );
};

export default ComplaintStatus;