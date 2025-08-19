import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<any, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#080F20', '#1F2937', '#374151']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="heart" size={60} color="#8B5FE6" />
            </View>
            <Text style={styles.appName}>Healing Journey</Text>
            <Text style={styles.tagline}>
              Transform your healing process with AI-powered support
            </Text>
          </View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <View style={styles.featureItem}>
              <Ionicons name="chatbubble-ellipses" size={32} color="#00D4FF" />
              <Text style={styles.featureTitle}>AI Therapy</Text>
              <Text style={styles.featureDescription}>
                24/7 personalized support when you need it most
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="calendar-outline" size={32} color="#00FF88" />
              <Text style={styles.featureTitle}>Daily Rituals</Text>
              <Text style={styles.featureDescription}>
                Build healing habits with guided daily practices
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="trending-up" size={32} color="#FF1B7A" />
              <Text style={styles.featureTitle}>Progress Tracking</Text>
              <Text style={styles.featureDescription}>
                Monitor your emotional growth and celebrate milestones
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('SignUp')}
            >
              <LinearGradient
                colors={['#8B5FE6', '#6D3ED1']}
                style={styles.buttonGradient}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Join thousands on their healing journey
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080F20',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: height * 0.08,
    marginBottom: height * 0.08,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(139, 95, 230, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(139, 95, 230, 0.3)',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 12,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresSection: {
    marginBottom: height * 0.08,
  },
  featureItem: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginTop: 12,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonSection: {
    marginBottom: 40,
  },
  primaryButton: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 230, 0.3)',
    backgroundColor: 'rgba(139, 95, 230, 0.05)',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B5FE6',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});
