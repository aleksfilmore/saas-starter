import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#10B981" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#081F20',
  },
  text: {
    marginTop: 16,
    color: '#E5E7EB',
    fontSize: 16,
    fontWeight: '500',
  },
});
