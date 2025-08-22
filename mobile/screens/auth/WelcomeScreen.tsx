import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

export function WelcomeScreen({ navigation }: Props) {
  return (
    <LinearGradient
      colors={['#081F20', '#0F2027', '#203A43']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>🌟</Text>
          <Text style={styles.title}>Glitch Therapy</Text>
          <Text style={styles.subtitle}>
            Break free from the past.{'\n'}
            Build your future, one ritual at a time.
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureText}>Daily Rituals</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🏆</Text>
            <Text style={styles.featureText}>Achievements</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>💎</Text>
            <Text style={styles.featureText}>Bytes Economy</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🛍️</Text>
            <Text style={styles.featureText}>Rewards Shop</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 40,
  },
  feature: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '500',
  },
  buttons: {
    gap: 16,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#374151',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#D1D5DB',
    fontSize: 18,
    fontWeight: '600',
  },
});
