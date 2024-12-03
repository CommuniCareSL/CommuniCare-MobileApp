import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const Records = () => {
  const [recordCounts, setRecordCounts] = useState({
    services: {
      inProgress: 8,
      completed: 3,
      pending: 5
    },
    complaints: {
      received: 10,
      inProgress: 5,
      completed: 15
    },
    appointments: {
      scheduled: 6,
      approved: 2,
      completed: 4
    }
  });
  const { t } = useTranslation();
  const RecordBox = ({ title, items, className }) => (
    <View className={`bg-blue-50 rounded-xl p-3 mb-4 shadow-md ${className}`}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xl font-bold text-blue-800">{title}</Text>
      </View>
      <View className="flex-row flex-wrap justify-between">
        {items.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            className="items-center w-[48%] mb-2"
            onPress={() => {/* Navigation or Detail View */}}
          >
            <Ionicons 
              name={item.icon} 
              size={22} 
              color={item.iconColor || "#4A90E2"} 
            />
            <Text className="text-xs font-semibold text-gray-800 mt-1 text-center">
              {item.title}
            </Text>
            <Text className="text-xl font-bold text-blue-600">
              {item.count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-3 bg-white flex-row items-center justify-center">
        <Text className="text-black text-xl font-bold">{t('tabs.Records.Records')}</Text>
      </View>
      <ScrollView 
        contentContainerStyle="px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <RecordBox
          title={t('tabs.Records.Services')}
          items={[
            { 
              title: t('tabs.Records.InProgress'), 
              count: recordCounts.services.inProgress, 
              icon: "construct-outline",
              iconColor: "#FFA500"
            },
            { 
              title: t('tabs.Records.Completed'), 
              count: recordCounts.services.completed, 
              icon: "checkmark-done-circle",
              iconColor: "#2E8B57"
            },
            { 
              title: t('tabs.Records.Pending'), 
              count: recordCounts.services.pending, 
              icon: "time-outline",
              iconColor: "#1E90FF"
            }
          ]}
          className="mb-4"
        />
        
        <RecordBox
          title= {t('tabs.Records.Complaints')}
          items={[
            { 
              title: t('tabs.Records.Received'), 
              count: recordCounts.complaints.received, 
              icon: "document-text-outline",
              iconColor: "#FFA500"
            },
            { 
              title: t('tabs.Records.InProgress1'), 
              count: recordCounts.complaints.inProgress, 
              icon: "time-outline",
              iconColor: "#1E90FF"
            },
            { 
              title: t('tabs.Records.Completed1'), 
              count: recordCounts.complaints.completed, 
              icon: "checkmark-circle",
              iconColor: "#2E8B57"
            }
          ]}
          className="mb-4"
        />
        
        <RecordBox
          title={t('tabs.Records.Appointments')}
          items={[
            { 
              title: t('tabs.Records.Scheduled'), 
              count: recordCounts.appointments.scheduled, 
              icon: "calendar",
              iconColor: "#FFA500"
            },
            { 
              title: t('tabs.Records.Approved'), 
              count: recordCounts.appointments.approved, 
              icon: "checkmark-circle-outline",
              iconColor: "#1E90FF"
            },
            { 
              title: t('tabs.Records.Completed'), 
              count: recordCounts.appointments.completed, 
              icon: "flag",
              iconColor: "#2E8B57"
            }
          ]}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Records;