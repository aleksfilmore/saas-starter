import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const { width } = Dimensions.get('window');

export function DashboardScreen() {
  const { user } = useAuth();
  const { todayActions, recentActions, rituals, loading } = useData();

  const completedToday = rituals?.filter(r => r.completed).length || 0;
  const totalRituals = rituals?.length || 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669', '#047857']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.displayName || user?.email}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{user?.bytes || 0}</Text>
              <Text style={styles.statLabel}>Bytes</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{user?.streak || 0}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{completedToday}/{totalRituals}</Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>⚡</Text>
              <Text style={styles.quickActionText}>Daily Ritual</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>🎯</Text>
              <Text style={styles.quickActionText}>Set Goal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionText}>Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>🛍️</Text>
              <Text style={styles.quickActionText}>Shop</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.card}>
            {todayActions && todayActions.length > 0 ? (
              todayActions.map((action, index) => (
                <View key={index} style={styles.actionItem}>
                  <View style={styles.actionInfo}>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionTime}>{action.time}</Text>
                  </View>
                  <View style={styles.actionReward}>
                    <Text style={styles.rewardText}>+{action.bytes} bytes</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🌱</Text>
                <Text style={styles.emptyText}>Start your first ritual today!</Text>
              </View>
            )}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.card}>
            {recentActions && recentActions.length > 0 ? (
              recentActions.slice(0, 5).map((action, index) => (
                <View key={index} style={styles.recentItem}>
                  <Text style={styles.recentTitle}>{action.title}</Text>
                  <Text style={styles.recentDate}>{action.date}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📈</Text>
                <Text style={styles.emptyText}>Your activity will appear here</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#081F20',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: (width - 72) / 2,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: '#D1D5DB',
    fontWeight: '600',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actionTime: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  actionReward: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  recentTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    flex: 1,
  },
  recentDate: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
