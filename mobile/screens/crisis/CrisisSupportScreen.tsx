import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'CrisisSupport'>;

interface CrisisResource {
  id: string;
  name: string;
  description: string;
  phone: string;
  website?: string;
  available: string;
  type: 'hotline' | 'chat' | 'text' | 'professional';
  urgent?: boolean;
}

interface CopingStrategy {
  id: string;
  title: string;
  description: string;
  steps: string[];
  icon: string;
  color: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080F20',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 27, 122, 0.1)',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 27, 122, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FF1B7A',
    fontWeight: '500',
  },
  emergencyCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emergencyGradient: {
    padding: 20,
    alignItems: 'center',
  },
  emergencyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emergencySubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  emergencyButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  emergencyButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  resourceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  urgentResource: {
    borderColor: 'rgba(255, 27, 122, 0.3)',
    backgroundColor: 'rgba(255, 27, 122, 0.05)',
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 27, 122, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 8,
  },
  resourceAvailable: {
    fontSize: 12,
    color: '#00FF88',
    fontWeight: '500',
  },
  urgentBadge: {
    backgroundColor: 'rgba(255, 27, 122, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  urgentText: {
    fontSize: 10,
    color: '#FF1B7A',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  resourceActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButton: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  copingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  copingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  copingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  copingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  copingDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 12,
  },
  copingSteps: {
    marginTop: 8,
  },
  copingStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 27, 122, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF1B7A',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  warningCard: {
    margin: 16,
    backgroundColor: 'rgba(255, 155, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 155, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
  },
  warningText: {
    fontSize: 14,
    color: '#FF9B00',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
});

export function CrisisSupportScreen({ navigation }: Props) {
  const [expandedCoping, setExpandedCoping] = useState<string | null>(null);

  const crisisResources: CrisisResource[] = [
    {
      id: '1',
      name: 'National Suicide Prevention Lifeline',
      description: 'Free and confidential emotional support to people in suicidal crisis or emotional distress',
      phone: '988',
      website: 'https://suicidepreventionlifeline.org',
      available: '24/7',
      type: 'hotline',
      urgent: true,
    },
    {
      id: '2',
      name: 'Crisis Text Line',
      description: 'Free, 24/7 support for those in crisis. Text HOME to connect with a counselor',
      phone: '741741',
      available: '24/7',
      type: 'text',
      urgent: true,
    },
    {
      id: '3',
      name: 'NAMI National Helpline',
      description: 'Information, resource referrals and support for individuals with mental health conditions',
      phone: '1-800-950-6264',
      website: 'https://www.nami.org',
      available: 'Mon-Fri 10am-10pm ET',
      type: 'hotline',
    },
    {
      id: '4',
      name: 'SAMHSA National Helpline',
      description: 'Treatment referral and information service for mental health and substance use disorders',
      phone: '1-800-662-4357',
      website: 'https://www.samhsa.gov',
      available: '24/7',
      type: 'hotline',
    },
  ];

  const copingStrategies: CopingStrategy[] = [
    {
      id: '1',
      title: 'Grounding Technique (5-4-3-2-1)',
      description: 'Use your senses to ground yourself in the present moment',
      icon: 'leaf',
      color: '#00FF88',
      steps: [
        'Name 5 things you can see around you',
        'Name 4 things you can touch',
        'Name 3 things you can hear',
        'Name 2 things you can smell',
        'Name 1 thing you can taste',
      ],
    },
    {
      id: '2',
      title: 'Box Breathing',
      description: 'A simple breathing technique to reduce anxiety and stress',
      icon: 'square',
      color: '#00D4FF',
      steps: [
        'Breathe in for 4 counts',
        'Hold your breath for 4 counts',
        'Breathe out for 4 counts',
        'Hold empty lungs for 4 counts',
        'Repeat 4-6 times',
      ],
    },
    {
      id: '3',
      title: 'Progressive Muscle Relaxation',
      description: 'Release physical tension to calm your mind',
      icon: 'body',
      color: '#8B5FE6',
      steps: [
        'Start with your toes - tense for 5 seconds, then relax',
        'Move up to your calves and repeat',
        'Continue with thighs, abdomen, arms, and shoulders',
        'Finish with your face and head',
        'Notice the difference between tension and relaxation',
      ],
    },
    {
      id: '4',
      title: 'STOP Technique',
      description: 'Interrupt overwhelming thoughts and emotions',
      icon: 'stop',
      color: '#FF1B7A',
      steps: [
        'STOP what you\'re doing',
        'TAKE a breath',
        'OBSERVE your thoughts, feelings, and surroundings',
        'PROCEED with awareness and intention',
      ],
    },
  ];

  const handleCall = (phone: string) => {
    Alert.alert(
      'Make Call',
      `Do you want to call ${phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${phone}`).catch(() => {
              Alert.alert('Error', 'Unable to make phone call');
            });
          },
        },
      ]
    );
  };

  const handleWebsite = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open website');
    });
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'hotline': return 'call';
      case 'chat': return 'chatbubbles';
      case 'text': return 'chatbox';
      case 'professional': return 'medical';
      default: return 'help';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#080F20', '#1F2937']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FF1B7A" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Crisis Support</Text>
            <Text style={styles.headerSubtitle}>You're not alone</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView>
          {/* Emergency Call */}
          <View style={styles.emergencyCard}>
            <LinearGradient
              colors={['rgba(255, 27, 122, 0.2)', 'rgba(255, 27, 122, 0.1)']}
              style={styles.emergencyGradient}
            >
              <View style={styles.emergencyIcon}>
                <Ionicons name="call" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.emergencyTitle}>Emergency Support</Text>
              <Text style={styles.emergencySubtitle}>
                If you're in immediate danger or having thoughts of self-harm
              </Text>
              <TouchableOpacity
                style={styles.emergencyButton}
                onPress={() => handleCall('988')}
              >
                <LinearGradient
                  colors={['#FF1B7A', '#8B5FE6']}
                  style={styles.emergencyButtonGradient}
                >
                  <Ionicons name="call" size={20} color="#FFFFFF" />
                  <Text style={styles.emergencyButtonText}>Call 988 Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Crisis Resources */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Crisis Resources</Text>
            {crisisResources.map((resource) => (
              <View
                key={resource.id}
                style={[
                  styles.resourceCard,
                  resource.urgent && styles.urgentResource
                ]}
              >
                <View style={styles.resourceHeader}>
                  <View style={styles.resourceIcon}>
                    <Ionicons
                      name={getResourceIcon(resource.type) as any}
                      size={20}
                      color="#FF1B7A"
                    />
                  </View>
                  <View style={styles.resourceInfo}>
                    <Text style={styles.resourceName}>{resource.name}</Text>
                    <Text style={styles.resourceDescription}>
                      {resource.description}
                    </Text>
                    <Text style={styles.resourceAvailable}>
                      Available: {resource.available}
                    </Text>
                  </View>
                  {resource.urgent && (
                    <View style={styles.urgentBadge}>
                      <Text style={styles.urgentText}>Urgent</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.resourceActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.callButton]}
                    onPress={() => handleCall(resource.phone)}
                  >
                    <Ionicons name="call" size={16} color="#00FF88" />
                    <Text style={styles.actionButtonText}>
                      {resource.type === 'text' ? 'Text' : 'Call'}
                    </Text>
                  </TouchableOpacity>
                  {resource.website && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleWebsite(resource.website!)}
                    >
                      <Ionicons name="globe" size={16} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Website</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Coping Strategies */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Coping Strategies</Text>
            {copingStrategies.map((strategy) => (
              <TouchableOpacity
                key={strategy.id}
                style={styles.copingCard}
                onPress={() => setExpandedCoping(
                  expandedCoping === strategy.id ? null : strategy.id
                )}
              >
                <View style={styles.copingHeader}>
                  <View style={[
                    styles.copingIcon,
                    { backgroundColor: `${strategy.color}20` }
                  ]}>
                    <Ionicons
                      name={strategy.icon as any}
                      size={20}
                      color={strategy.color}
                    />
                  </View>
                  <Text style={styles.copingTitle}>{strategy.title}</Text>
                </View>
                
                <Text style={styles.copingDescription}>
                  {strategy.description}
                </Text>

                {expandedCoping === strategy.id && (
                  <View style={styles.copingSteps}>
                    {strategy.steps.map((step, index) => (
                      <View key={index} style={styles.copingStep}>
                        <View style={styles.stepNumber}>
                          <Text style={styles.stepNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.stepText}>{step}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Warning */}
          <View style={styles.warningCard}>
            <Text style={styles.warningText}>
              This app is not a substitute for professional mental health care. 
              If you're experiencing a mental health emergency, please contact emergency services immediately.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
