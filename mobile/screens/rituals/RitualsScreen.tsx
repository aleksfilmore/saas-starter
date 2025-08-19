import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Ritual {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: 'morning' | 'evening' | 'moment' | 'crisis';
  completed: boolean;
  streak: number;
}

export function RitualsScreen() {
  const [activeTab, setActiveTab] = useState<'daily' | 'custom' | 'emergency'>('daily');
  
  const [rituals, setRituals] = useState<Ritual[]>([
    {
      id: '1',
      title: 'Morning Intention Setting',
      description: 'Set your healing intentions for the day',
      duration: 5,
      category: 'morning',
      completed: false,
      streak: 3,
    },
    {
      id: '2',
      title: 'Mindful Breathing',
      description: 'Deep breathing exercise for grounding',
      duration: 10,
      category: 'moment',
      completed: true,
      streak: 7,
    },
    {
      id: '3',
      title: 'Evening Reflection',
      description: 'Reflect on your healing journey today',
      duration: 15,
      category: 'evening',
      completed: false,
      streak: 5,
    },
    {
      id: '4',
      title: 'Crisis Grounding',
      description: '5-4-3-2-1 sensory grounding technique',
      duration: 3,
      category: 'crisis',
      completed: false,
      streak: 0,
    },
  ]);

  const toggleRitual = (ritualId: string) => {
    setRituals(prev => 
      prev.map(ritual => 
        ritual.id === ritualId 
          ? { ...ritual, completed: !ritual.completed }
          : ritual
      )
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'morning': return '#00FF88';
      case 'evening': return '#8B5FE6';
      case 'moment': return '#00D4FF';
      case 'crisis': return '#FF1B7A';
      default: return '#8B5FE6';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'morning': return 'sunny';
      case 'evening': return 'moon';
      case 'moment': return 'time';
      case 'crisis': return 'warning';
      default: return 'flower';
    }
  };

  const filteredRituals = rituals.filter(ritual => {
    if (activeTab === 'daily') return ritual.category === 'morning' || ritual.category === 'evening';
    if (activeTab === 'custom') return ritual.category === 'moment';
    if (activeTab === 'emergency') return ritual.category === 'crisis';
    return true;
  });

  const completedToday = rituals.filter(r => r.completed).length;
  const totalRituals = rituals.length;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#080F20', '#1F2937']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Daily Rituals</Text>
            <Text style={styles.subtitle}>Nurture your healing journey</Text>
          </View>

          {/* Progress Overview */}
          <View style={styles.progressCard}>
            <LinearGradient
              colors={['rgba(139, 95, 230, 0.1)', 'rgba(139, 95, 230, 0.05)']}
              style={styles.progressGradient}
            >
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Today's Progress</Text>
                <Text style={styles.progressNumber}>
                  {completedToday}/{totalRituals}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#8B5FE6', '#FF1B7A']}
                  style={[
                    styles.progressFill,
                    { width: `${(completedToday / totalRituals) * 100}%` }
                  ]}
                />
              </View>
            </LinearGradient>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            {[
              { key: 'daily', label: 'Daily', icon: 'calendar' },
              { key: 'custom', label: 'Moments', icon: 'time' },
              { key: 'emergency', label: 'Crisis', icon: 'warning' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  activeTab === tab.key && styles.activeTab
                ]}
                onPress={() => setActiveTab(tab.key as any)}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={20}
                  color={activeTab === tab.key ? '#FFFFFF' : '#94A3B8'}
                />
                <Text style={[
                  styles.tabText,
                  activeTab === tab.key && styles.activeTabText
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Rituals List */}
          <View style={styles.ritualsContainer}>
            {filteredRituals.map((ritual) => (
              <TouchableOpacity
                key={ritual.id}
                style={[
                  styles.ritualCard,
                  ritual.completed && styles.ritualCompleted
                ]}
                onPress={() => toggleRitual(ritual.id)}
              >
                <View style={styles.ritualHeader}>
                  <View style={styles.ritualLeft}>
                    <View style={[
                      styles.ritualIcon,
                      { backgroundColor: `${getCategoryColor(ritual.category)}20` }
                    ]}>
                      <Ionicons
                        name={getCategoryIcon(ritual.category) as any}
                        size={24}
                        color={getCategoryColor(ritual.category)}
                      />
                    </View>
                    <View style={styles.ritualInfo}>
                      <Text style={[
                        styles.ritualTitle,
                        ritual.completed && styles.ritualTitleCompleted
                      ]}>
                        {ritual.title}
                      </Text>
                      <Text style={styles.ritualDescription}>
                        {ritual.description}
                      </Text>
                      <View style={styles.ritualMeta}>
                        <Ionicons name="time-outline" size={14} color="#94A3B8" />
                        <Text style={styles.ritualDuration}>
                          {ritual.duration} min
                        </Text>
                        {ritual.streak > 0 && (
                          <>
                            <Ionicons name="flame" size={14} color="#FF1B7A" />
                            <Text style={styles.ritualStreak}>
                              {ritual.streak} day streak
                            </Text>
                          </>
                        )}
                      </View>
                    </View>
                  </View>
                  <Ionicons
                    name={ritual.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={28}
                    color={ritual.completed ? '#00FF88' : '#64748B'}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Add Custom Ritual */}
          {activeTab === 'custom' && (
            <TouchableOpacity style={styles.addButton}>
              <LinearGradient
                colors={['rgba(139, 95, 230, 0.1)', 'rgba(139, 95, 230, 0.05)']}
                style={styles.addButtonGradient}
              >
                <Ionicons name="add-circle-outline" size={24} color="#8B5FE6" />
                <Text style={styles.addButtonText}>Create Custom Ritual</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Emergency Help */}
          {activeTab === 'emergency' && (
            <View style={styles.emergencyInfo}>
              <LinearGradient
                colors={['rgba(255, 27, 122, 0.1)', 'rgba(255, 27, 122, 0.05)']}
                style={styles.emergencyGradient}
              >
                <Ionicons name="heart" size={32} color="#FF1B7A" />
                <Text style={styles.emergencyTitle}>You're Not Alone</Text>
                <Text style={styles.emergencyText}>
                  These rituals are designed for moments of crisis. Remember, reaching out for professional help is always okay.
                </Text>
                <TouchableOpacity style={styles.emergencyButton}>
                  <Text style={styles.emergencyButtonText}>Get Professional Help</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

          {/* Bottom spacing */}
          <View style={styles.bottomSpacing} />
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
  },
  progressCard: {
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  progressGradient: {
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5FE6',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#8B5FE6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  ritualsContainer: {
    paddingHorizontal: 20,
  },
  ritualCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 230, 0.1)',
  },
  ritualCompleted: {
    backgroundColor: 'rgba(0, 255, 136, 0.05)',
    borderColor: 'rgba(0, 255, 136, 0.2)',
  },
  ritualHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ritualLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ritualIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  ritualInfo: {
    flex: 1,
  },
  ritualTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  ritualTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  ritualDescription: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 8,
    lineHeight: 20,
  },
  ritualMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ritualDuration: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 4,
    marginRight: 12,
  },
  ritualStreak: {
    fontSize: 12,
    color: '#FF1B7A',
    marginLeft: 4,
    fontWeight: '600',
  },
  addButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  addButtonGradient: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5FE6',
    marginLeft: 8,
  },
  emergencyInfo: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emergencyGradient: {
    padding: 24,
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginTop: 12,
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emergencyButton: {
    backgroundColor: '#FF1B7A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});
