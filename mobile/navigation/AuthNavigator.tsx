import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyle: { backgroundColor: '#081F20' },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
