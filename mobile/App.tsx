import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';
import { RootNavigator } from './navigation/RootNavigator';
import { View, StyleSheet } from 'react-native';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider>
            <DataProvider>
              <NotificationProvider>
                <View style={styles.app}>
                  <StatusBar style="light" backgroundColor="#081F20" />
                  <RootNavigator />
                </View>
              </NotificationProvider>
            </DataProvider>
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  app: {
    flex: 1,
    backgroundColor: '#081F20', // Dark background matching web app
  },
});
