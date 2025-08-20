import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from '../components/ui/LoadingScreen';

// Auth Screens
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';

// Main App Screens
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { RitualsScreen } from '../screens/rituals/RitualsScreen';
import { ProgressScreen } from '../screens/progress/ProgressScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

// Advanced Feature Screens
import { AITherapyScreen } from '../screens/ai-therapy/AITherapyScreen';
import { WallOfWoundsScreen } from '../screens/wall/WallOfWoundsScreen';
import { CrisisSupportScreen } from '../screens/crisis/CrisisSupportScreen';
import { ScanReflectScreen } from '../screens/scan/ScanReflectScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Rituals') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#EC4899',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#1F2937',
          borderTopColor: '#374151',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#080F20',
        },
        headerTintColor: '#F8FAFC',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Rituals" component={RitualsScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#080F20' },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function AppStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#080F20' },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen 
        name="AITherapy" 
        component={AITherapyScreen}
        options={{
          headerShown: true,
          title: 'AI Therapy',
          headerStyle: { backgroundColor: '#080F20' },
          headerTintColor: '#F8FAFC',
        }}
      />
      <Stack.Screen 
        name="WallOfWounds" 
        component={WallOfWoundsScreen}
        options={{
          headerShown: true,
          title: 'Wall of Wounds',
          headerStyle: { backgroundColor: '#080F20' },
          headerTintColor: '#F8FAFC',
        }}
      />
      <Stack.Screen 
        name="CrisisSupport" 
        component={CrisisSupportScreen}
        options={{
          headerShown: true,
          title: 'Crisis Support',
          headerStyle: { backgroundColor: '#080F20' },
          headerTintColor: '#F8FAFC',
        }}
      />
      <Stack.Screen 
        name="ScanReflect" 
        component={ScanReflectScreen}
        options={{
          headerShown: true,
          title: 'Scan & Reflect',
          headerStyle: { backgroundColor: '#080F20' },
          headerTintColor: '#F8FAFC',
        }}
      />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <AppStackNavigator /> : <AuthStackNavigator />;
}
