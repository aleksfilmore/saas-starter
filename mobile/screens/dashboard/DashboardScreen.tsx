import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

interface DailyTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  type: 'ritual' | 'reflection' | 'exercise';
  points: number;
}

interface ProgressStats {
  totalPoints: number;
  weeklyStreak: number;
  completedTasks: number;
  totalTasks: number;
}

export function DashboardScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([
    {
      id: '1',
      title: 'Morning Reflection',
      description: 'Take 5 minutes to reflect on your intentions',
      completed: false,
      type: 'reflection',
      points: 10,
    },
    {
      id: '2',
      title: 'Healing Ritual',
      description: 'Complete your personalized healing practice',
      completed: true,
      type: 'ritual',
      points: 20,
    },
    {
      id: '3',
      title: 'Mindfulness Exercise',
      description: 'Practice a 10-minute mindfulness session',
      completed: false,
      type: 'exercise',
      points: 15,
    },
  ]);

  const [progressStats, setProgressStats] = useState<ProgressStats>({
    totalPoints: 245,
    weeklyStreak: 5,
    completedTasks: 12,
    totalTasks: 18,
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const toggleTask = (taskId: string) => {
    setDailyTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'ritual': return 'flower';
      case 'reflection': return 'journal';
      case 'exercise': return 'fitness';
      default: return 'checkbox';
    }
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'ritual': return '#8B5FE6';
      case 'reflection': return '#00D4FF';
      case 'exercise': return '#00FF88';
      default: return '#8B5FE6';
    }
  };

  const completedTasksCount = dailyTasks.filter(task => task.completed).length;
  const progressPercentage = (completedTasksCount / dailyTasks.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#080F20', '#1F2937']}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.email?.split('@')[0] || 'Traveler'}</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person-circle" size={40} color="#8B5FE6" />
            </TouchableOpacity>
          </View>

          {/* Progress Overview */}
          <View style={styles.progressCard}>
            <LinearGradient
              colors={['rgba(139, 95, 230, 0.1)', 'rgba(139, 95, 230, 0.05)']}
              style={styles.progressGradient}
            >
              <Text style={styles.progressTitle}>Today's Progress</Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={['#8B5FE6', '#FF1B7A']}
                    style={[styles.progressFill, { width: `${progressPercentage}%` }]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {completedTasksCount}/{dailyTasks.length} tasks
                </Text>
              </View>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{progressStats.totalPoints}</Text>
                  <Text style={styles.statLabel}>Total Points</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{progressStats.weeklyStreak}</Text>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{Math.round(progressPercentage)}%</Text>
                  <Text style={styles.statLabel}>Complete</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Daily Tasks */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            {dailyTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[
                  styles.taskCard,
                  task.completed && styles.taskCompleted
                ]}
                onPress={() => toggleTask(task.id)}
              >
                <View style={styles.taskLeft}>
                  <View style={[
                    styles.taskIcon,
                    { backgroundColor: `${getTaskColor(task.type)}20` }
                  ]}>
                    <Ionicons
                      name={getTaskIcon(task.type) as any}
                      size={20}
                      color={getTaskColor(task.type)}
                    />
                  </View>
                  <View style={styles.taskContent}>
                    <Text style={[
                      styles.taskTitle,
                      task.completed && styles.taskTitleCompleted
                    ]}>
                      {task.title}
                    </Text>
                    <Text style={styles.taskDescription}>
                      {task.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.taskRight}>
                  <Text style={styles.taskPoints}>+{task.points}</Text>
                  <Ionicons
                    name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={task.completed ? '#00FF88' : '#64748B'}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionCard}>
                <LinearGradient
                  colors={['rgba(0, 212, 255, 0.1)', 'rgba(0, 212, 255, 0.05)']}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="chatbubble-ellipses" size={28} color="#00D4FF" />
                  <Text style={styles.quickActionTitle}>AI Therapy</Text>
                  <Text style={styles.quickActionSubtitle}>Chat now</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionCard}>
                <LinearGradient
                  colors={['rgba(255, 27, 122, 0.1)', 'rgba(255, 27, 122, 0.05)']}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="heart" size={28} color="#FF1B7A" />
                  <Text style={styles.quickActionTitle}>Wall of Wounds</Text>
                  <Text style={styles.quickActionSubtitle}>Add entry</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionCard}>
                <LinearGradient
                  colors={['rgba(0, 255, 136, 0.1)', 'rgba(0, 255, 136, 0.05)']}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="leaf" size={28} color="#00FF88" />
                  <Text style={styles.quickActionTitle}>Crisis Support</Text>
                  <Text style={styles.quickActionSubtitle}>Get help</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionCard}>
                <LinearGradient
                  colors={['rgba(139, 95, 230, 0.1)', 'rgba(139, 95, 230, 0.05)']}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="scan" size={28} color="#8B5FE6" />
                  <Text style={styles.quickActionTitle}>Scan & Reflect</Text>
                  <Text style={styles.quickActionSubtitle}>Quick scan</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  profileButton: {
    padding: 4,
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
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  taskCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 230, 0.1)',
  },
  taskCompleted: {
    backgroundColor: 'rgba(0, 255, 136, 0.05)',
    borderColor: 'rgba(0, 255, 136, 0.2)',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  taskDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 18,
  },
  taskRight: {
    alignItems: 'center',
  },
  taskPoints: {
    fontSize: 12,
    color: '#8B5FE6',
    fontWeight: '600',
    marginBottom: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickActionGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});
