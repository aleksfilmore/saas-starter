import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ProgressData {
  week: string;
  points: number;
  tasksCompleted: number;
  mood: number; // 1-5 scale
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  total: number;
}

export function ProgressScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  
  const weeklyData: ProgressData[] = [
    { week: 'Mon', points: 45, tasksCompleted: 3, mood: 4 },
    { week: 'Tue', points: 38, tasksCompleted: 2, mood: 3 },
    { week: 'Wed', points: 52, tasksCompleted: 4, mood: 5 },
    { week: 'Thu', points: 41, tasksCompleted: 3, mood: 4 },
    { week: 'Fri', points: 35, tasksCompleted: 2, mood: 3 },
    { week: 'Sat', points: 48, tasksCompleted: 3, mood: 4 },
    { week: 'Sun', points: 55, tasksCompleted: 4, mood: 5 },
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first healing ritual',
      icon: 'footsteps',
      unlocked: true,
      progress: 1,
      total: 1,
    },
    {
      id: '2',
      title: 'Consistent Healer',
      description: 'Complete tasks 7 days in a row',
      icon: 'calendar',
      unlocked: true,
      progress: 7,
      total: 7,
    },
    {
      id: '3',
      title: 'Reflection Master',
      description: 'Complete 50 reflection exercises',
      icon: 'journal',
      unlocked: false,
      progress: 23,
      total: 50,
    },
    {
      id: '4',
      title: 'AI Companion',
      description: 'Have 20 AI therapy sessions',
      icon: 'chatbubble-ellipses',
      unlocked: false,
      progress: 8,
      total: 20,
    },
  ];

  const totalPoints = weeklyData.reduce((sum, day) => sum + day.points, 0);
  const averageMood = weeklyData.reduce((sum, day) => sum + day.mood, 0) / weeklyData.length;
  const totalTasks = weeklyData.reduce((sum, day) => sum + day.tasksCompleted, 0);

  const maxPoints = Math.max(...weeklyData.map(d => d.points));

  const getMoodEmoji = (mood: number) => {
    switch (Math.round(mood)) {
      case 1: return '😢';
      case 2: return '😕';
      case 3: return '😐';
      case 4: return '😊';
      case 5: return '😄';
      default: return '😐';
    }
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 4.5) return '#00FF88';
    if (mood >= 3.5) return '#00D4FF';
    if (mood >= 2.5) return '#FF1B7A';
    return '#FF6B6B';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#080F20', '#1F2937']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Your Progress</Text>
            <Text style={styles.subtitle}>Track your healing journey</Text>
          </View>

          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {(['week', 'month', 'year'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive
                ]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stats Overview */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(139, 95, 230, 0.1)', 'rgba(139, 95, 230, 0.05)']}
                style={styles.statGradient}
              >
                <Ionicons name="trophy" size={24} color="#8B5FE6" />
                <Text style={styles.statNumber}>{totalPoints}</Text>
                <Text style={styles.statLabel}>Total Points</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(0, 212, 255, 0.1)', 'rgba(0, 212, 255, 0.05)']}
                style={styles.statGradient}
              >
                <Ionicons name="checkmark-circle" size={24} color="#00D4FF" />
                <Text style={styles.statNumber}>{totalTasks}</Text>
                <Text style={styles.statLabel}>Tasks Done</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={[`${getMoodColor(averageMood)}20`, `${getMoodColor(averageMood)}10`]}
                style={styles.statGradient}
              >
                <Text style={styles.moodEmoji}>{getMoodEmoji(averageMood)}</Text>
                <Text style={styles.statNumber}>{averageMood.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Avg Mood</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Weekly Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Weekly Progress</Text>
            <View style={styles.chart}>
              {weeklyData.map((day, index) => (
                <View key={day.week} style={styles.chartBar}>
                  <View style={styles.barContainer}>
                    <LinearGradient
                      colors={['#8B5FE6', '#FF1B7A']}
                      style={[
                        styles.bar,
                        { height: `${(day.points / maxPoints) * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{day.week}</Text>
                  <Text style={styles.barValue}>{day.points}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Mood Tracker */}
          <View style={styles.moodContainer}>
            <Text style={styles.sectionTitle}>Mood This Week</Text>
            <View style={styles.moodChart}>
              {weeklyData.map((day, index) => (
                <View key={day.week} style={styles.moodDay}>
                  <Text style={styles.moodEmoji}>{getMoodEmoji(day.mood)}</Text>
                  <Text style={styles.moodDayLabel}>{day.week}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.achievementsContainer}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={[
                styles.achievementCard,
                achievement.unlocked && styles.achievementUnlocked
              ]}>
                <View style={styles.achievementLeft}>
                  <View style={[
                    styles.achievementIcon,
                    achievement.unlocked && styles.achievementIconUnlocked
                  ]}>
                    <Ionicons
                      name={achievement.icon as any}
                      size={24}
                      color={achievement.unlocked ? '#00FF88' : '#64748B'}
                    />
                  </View>
                  <View style={styles.achievementContent}>
                    <Text style={[
                      styles.achievementTitle,
                      achievement.unlocked && styles.achievementTitleUnlocked
                    ]}>
                      {achievement.title}
                    </Text>
                    <Text style={styles.achievementDescription}>
                      {achievement.description}
                    </Text>
                    <View style={styles.achievementProgress}>
                      <View style={styles.progressBar}>
                        <View style={[
                          styles.progressFill,
                          { width: `${(achievement.progress / achievement.total) * 100}%` }
                        ]} />
                      </View>
                      <Text style={styles.progressText}>
                        {achievement.progress}/{achievement.total}
                      </Text>
                    </View>
                  </View>
                </View>
                {achievement.unlocked && (
                  <Ionicons name="trophy" size={20} color="#00FF88" />
                )}
              </View>
            ))}
          </View>

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
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#8B5FE6',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  chartContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 10,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 80,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  barValue: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  moodContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  moodChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  moodDay: {
    alignItems: 'center',
  },
  moodDayLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 8,
  },
  achievementsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.2)',
  },
  achievementUnlocked: {
    backgroundColor: 'rgba(0, 255, 136, 0.05)',
    borderColor: 'rgba(0, 255, 136, 0.2)',
  },
  achievementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementIconUnlocked: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
  },
  achievementTitleUnlocked: {
    color: '#F8FAFC',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    lineHeight: 18,
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5FE6',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});
