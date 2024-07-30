import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'services') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'contact') {
            iconName = focused ? 'call' : 'call-outline';
          } else if (route.name === 'records') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          tabBarLabel: 'Services',
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          tabBarLabel: 'Contact',
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          tabBarLabel: 'Records',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
