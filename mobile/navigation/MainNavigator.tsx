import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { RitualsScreen } from '../screens/main/RitualsScreen';
import { ShopScreen } from '../screens/main/ShopScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';

export type MainTabParamList = {
  Dashboard: undefined;
  Rituals: undefined;
  Shop: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Rituals') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Shop') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#0F2027',
          borderTopColor: '#1F2937',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Rituals" component={RitualsScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
