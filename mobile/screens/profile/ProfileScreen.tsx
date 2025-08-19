import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

interface ProfileSetting {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  action: () => void;
  showArrow?: boolean;
  color?: string;
}

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const profileSettings: ProfileSetting[] = [
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: 'person-outline',
      action: () => Alert.alert('Info', 'Edit profile feature coming soon!'),
      showArrow: true,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: notificationsEnabled ? 'Enabled' : 'Disabled',
      icon: 'notifications-outline',
      action: () => setNotificationsEnabled(!notificationsEnabled),
      showArrow: true,
    },
    {
      id: 'privacy',
      title: 'Privacy Settings',
      subtitle: 'Manage your data and privacy',
      icon: 'shield-outline',
      action: () => Alert.alert('Info', 'Privacy settings coming soon!'),
      showArrow: true,
    },
    {
      id: 'backup',
      title: 'Backup & Sync',
      subtitle: 'Keep your data safe',
      icon: 'cloud-outline',
      action: () => Alert.alert('Info', 'Backup feature coming soon!'),
      showArrow: true,
    },
  ];

  const supportSettings: ProfileSetting[] = [
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help when you need it',
      icon: 'help-circle-outline',
      action: () => Alert.alert('Info', 'Help center coming soon!'),
      showArrow: true,
    },
    {
      id: 'feedback',
      title: 'Send Feedback',
      subtitle: 'Help us improve the app',
      icon: 'chatbubble-outline',
      action: () => Alert.alert('Info', 'Feedback feature coming soon!'),
      showArrow: true,
    },
    {
      id: 'about',
      title: 'About Healing Journey',
      subtitle: 'Version 1.0.0',
      icon: 'information-circle-outline',
      action: () => Alert.alert('About', 'Healing Journey v1.0.0\nYour companion for emotional healing'),
      showArrow: true,
    },
  ];

  const dangerSettings: ProfileSetting[] = [
    {
      id: 'delete-account',
      title: 'Delete Account',
      subtitle: 'Permanently delete your account',
      icon: 'trash-outline',
      action: () => Alert.alert('Delete Account', 'This feature will be available soon. Please contact support for account deletion.'),
      color: '#FF1B7A',
    },
    {
      id: 'sign-out',
      title: 'Sign Out',
      subtitle: 'Sign out of your account',
      icon: 'log-out-outline',
      action: handleSignOut,
      color: '#FF1B7A',
    },
  ];

  const renderSettingSection = (title: string, settings: ProfileSetting[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {settings.map((setting) => (
        <TouchableOpacity
          key={setting.id}
          style={styles.settingItem}
          onPress={setting.action}
        >
          <View style={styles.settingLeft}>
            <View style={[
              styles.settingIcon,
              setting.color ? { backgroundColor: `${setting.color}20` } : null
            ]}>
              <Ionicons
                name={setting.icon as any}
                size={24}
                color={setting.color || '#8B5FE6'}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={[
                styles.settingTitle,
                setting.color ? { color: setting.color } : null
              ]}>
                {setting.title}
              </Text>
              {setting.subtitle && (
                <Text style={styles.settingSubtitle}>
                  {setting.subtitle}
                </Text>
              )}
            </View>
          </View>
          {setting.showArrow && (
            <Ionicons name="chevron-forward" size={20} color="#64748B" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#080F20', '#1F2937']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <LinearGradient
              colors={['rgba(139, 95, 230, 0.1)', 'rgba(139, 95, 230, 0.05)']}
              style={styles.profileGradient}
            >
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['#8B5FE6', '#FF1B7A']}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>
                    {user?.email?.charAt(0).toUpperCase() || 'T'}
                  </Text>
                </LinearGradient>
              </View>
              <Text style={styles.userName}>
                {user?.email?.split('@')[0] || 'Traveler'}
              </Text>
              <Text style={styles.userEmail}>
                {user?.email || 'traveler@example.com'}
              </Text>
              
              {/* Quick Stats */}
              <View style={styles.quickStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>245</Text>
                  <Text style={styles.statLabel}>Points</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>7</Text>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>18</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Settings Sections */}
          {renderSettingSection('Account', profileSettings)}
          {renderSettingSection('Support', supportSettings)}
          {renderSettingSection('Danger Zone', dangerSettings)}

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
  profileHeader: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileGradient: {
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 24,
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  settingItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 230, 0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(139, 95, 230, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  bottomSpacing: {
    height: 20,
  },
});
