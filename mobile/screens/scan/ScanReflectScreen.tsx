import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'ScanReflect'>;

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  emotions: string[];
  reflection: string;
  timestamp: Date;
  insights?: string[];
}

interface EmotionOption {
  id: string;
  name: string;
  color: string;
  icon: string;
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
    color: '#00D4FF',
    fontWeight: '500',
  },
  scanCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  scanGradient: {
    padding: 24,
    alignItems: 'center',
  },
  scanAnimation: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#00D4FF',
  },
  scanInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  scanSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  scanButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 200,
  },
  scanButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
  moodSelector: {
    marginBottom: 24,
  },
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  moodOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'transparent',
    flex: 1,
    marginHorizontal: 4,
  },
  moodOptionActive: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderColor: '#00D4FF',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    fontWeight: '500',
  },
  moodLabelActive: {
    color: '#00D4FF',
  },
  intensitySlider: {
    marginBottom: 24,
  },
  intensityValue: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  intensityTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  intensityDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 4,
  },
  intensityDotActive: {
    backgroundColor: '#00D4FF',
    transform: [{ scale: 1.2 }],
  },
  emotionSelector: {
    marginBottom: 24,
  },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emotionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  emotionChipActive: {
    backgroundColor: 'rgba(255, 27, 122, 0.2)',
    borderColor: '#FF1B7A',
  },
  emotionText: {
    fontSize: 14,
    color: '#94A3B8',
    marginLeft: 6,
    fontWeight: '500',
  },
  emotionTextActive: {
    color: '#FF1B7A',
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultMood: {
    fontSize: 48,
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  insightSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  historyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyMood: {
    fontSize: 24,
  },
  historyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 12,
    color: '#64748B',
  },
  historyEmotions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  historyEmotion: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 27, 122, 0.1)',
  },
  historyEmotionText: {
    fontSize: 10,
    color: '#FF1B7A',
    fontWeight: '500',
  },
});

export function ScanReflectScreen({ navigation }: Props) {
  const [currentStep, setCurrentStep] = useState<'scan' | 'mood' | 'result'>('scan');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(5);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [scanAnimation] = useState(new Animated.Value(0));
  const [showResult, setShowResult] = useState(false);

  const moodOptions = [
    { emoji: '😊', label: 'Great', value: 'great' },
    { emoji: '🙂', label: 'Good', value: 'good' },
    { emoji: '😐', label: 'Okay', value: 'okay' },
    { emoji: '😔', label: 'Low', value: 'low' },
    { emoji: '😢', label: 'Bad', value: 'bad' },
  ];

  const emotionOptions: EmotionOption[] = [
    { id: '1', name: 'Happy', color: '#00FF88', icon: 'happy' },
    { id: '2', name: 'Sad', color: '#00D4FF', icon: 'sad' },
    { id: '3', name: 'Anxious', color: '#FF9500', icon: 'warning' },
    { id: '4', name: 'Angry', color: '#FF1B7A', icon: 'flame' },
    { id: '5', name: 'Excited', color: '#8B5FE6', icon: 'flash' },
    { id: '6', name: 'Peaceful', color: '#00D4FF', icon: 'leaf' },
    { id: '7', name: 'Confused', color: '#94A3B8', icon: 'help' },
    { id: '8', name: 'Grateful', color: '#00FF88', icon: 'heart' },
  ];

  const recentEntries: MoodEntry[] = [
    {
      id: '1',
      mood: 'good',
      intensity: 7,
      emotions: ['Happy', 'Grateful'],
      reflection: 'Had a productive day at work',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '2',
      mood: 'okay',
      intensity: 5,
      emotions: ['Anxious', 'Confused'],
      reflection: 'Feeling uncertain about upcoming decisions',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
  ];

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startAnimation();
  }, []);

  const startScan = () => {
    setCurrentStep('mood');
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setTimeout(() => {
      setCurrentStep('result');
      generateInsights();
    }, 500);
  };

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const generateInsights = () => {
    setShowResult(true);
  };

  const getInsights = () => {
    const insights = [];
    
    if (selectedMood === 'great' || selectedMood === 'good') {
      insights.push('You\'re experiencing positive emotions. Consider what contributed to this mood.');
      insights.push('This is a good time to practice gratitude and mindfulness.');
    } else if (selectedMood === 'low' || selectedMood === 'bad') {
      insights.push('It\'s okay to feel this way. Remember that emotions are temporary.');
      insights.push('Consider reaching out to someone you trust or practicing self-care.');
    } else {
      insights.push('Neutral moods are normal. Take time to check in with yourself.');
    }

    if (selectedEmotions.includes('Anxious')) {
      insights.push('Try some breathing exercises or grounding techniques to manage anxiety.');
    }
    
    if (selectedEmotions.includes('Grateful')) {
      insights.push('Gratitude is a powerful tool for mental well-being. Keep cultivating it.');
    }

    return insights;
  };

  const saveEntry = () => {
    Alert.alert('Saved', 'Your mood entry has been saved to your journal.');
    setCurrentStep('scan');
    setSelectedMood('');
    setSelectedEmotions([]);
    setIntensity(5);
    setShowResult(false);
  };

  const getMoodEmoji = (mood: string) => {
    const option = moodOptions.find(m => m.value === mood);
    return option ? option.emoji : '😐';
  };

  const getMoodLabel = (mood: string) => {
    const option = moodOptions.find(m => m.value === mood);
    return option ? option.label : 'Neutral';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const pulseScale = scanAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const pulseOpacity = scanAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

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
            <Text style={styles.headerTitle}>Scan & Reflect</Text>
            <Text style={styles.headerSubtitle}>Check in with yourself</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView>
          {currentStep === 'scan' && (
            <>
              {/* Scan Interface */}
              <View style={styles.scanCard}>
                <LinearGradient
                  colors={['rgba(0, 212, 255, 0.1)', 'rgba(0, 212, 255, 0.05)']}
                  style={styles.scanGradient}
                >
                  <Animated.View
                    style={[
                      styles.scanAnimation,
                      {
                        transform: [{ scale: pulseScale }],
                        opacity: pulseOpacity,
                      },
                    ]}
                  >
                    <View style={styles.scanInner}>
                      <Ionicons name="scan" size={32} color="#00D4FF" />
                    </View>
                  </Animated.View>
                  
                  <Text style={styles.scanTitle}>Emotional Check-In</Text>
                  <Text style={styles.scanSubtitle}>
                    Take a moment to pause and reflect on how you're feeling right now.
                    This simple practice can help you understand your emotions better.
                  </Text>
                  
                  <TouchableOpacity
                    style={styles.scanButton}
                    onPress={startScan}
                  >
                    <LinearGradient
                      colors={['#00D4FF', '#8B5FE6']}
                      style={styles.scanButtonGradient}
                    >
                      <Ionicons name="play" size={16} color="#FFFFFF" />
                      <Text style={styles.scanButtonText}>Start Scan</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </LinearGradient>
              </View>

              {/* Recent Entries */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Recent Check-ins</Text>
                {recentEntries.map((entry) => (
                  <View key={entry.id} style={styles.historyCard}>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyMood}>
                        {getMoodEmoji(entry.mood)}
                      </Text>
                      <View style={styles.historyInfo}>
                        <Text style={styles.historyTitle}>
                          {getMoodLabel(entry.mood)} (Intensity: {entry.intensity}/10)
                        </Text>
                        <Text style={styles.historyTime}>
                          {formatTimeAgo(entry.timestamp)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.historyEmotions}>
                      {entry.emotions.map((emotion, index) => (
                        <View key={index} style={styles.historyEmotion}>
                          <Text style={styles.historyEmotionText}>{emotion}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {currentStep === 'mood' && (
            <View style={styles.sectionContainer}>
              {/* Mood Selection */}
              <View style={styles.moodSelector}>
                <Text style={styles.sectionTitle}>How are you feeling?</Text>
                <View style={styles.moodOptions}>
                  {moodOptions.map((mood) => (
                    <TouchableOpacity
                      key={mood.value}
                      style={[
                        styles.moodOption,
                        selectedMood === mood.value && styles.moodOptionActive
                      ]}
                      onPress={() => handleMoodSelect(mood.value)}
                    >
                      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                      <Text style={[
                        styles.moodLabel,
                        selectedMood === mood.value && styles.moodLabelActive
                      ]}>
                        {mood.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Intensity Slider */}
              <View style={styles.intensitySlider}>
                <Text style={styles.sectionTitle}>Intensity Level</Text>
                <Text style={styles.intensityValue}>{intensity}/10</Text>
                <View style={styles.intensityTrack}>
                  {[...Array(10)].map((_, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.intensityDot,
                        index < intensity && styles.intensityDotActive
                      ]}
                      onPress={() => setIntensity(index + 1)}
                    />
                  ))}
                </View>
              </View>

              {/* Emotion Selection */}
              <View style={styles.emotionSelector}>
                <Text style={styles.sectionTitle}>What emotions are present?</Text>
                <View style={styles.emotionGrid}>
                  {emotionOptions.map((emotion) => (
                    <TouchableOpacity
                      key={emotion.id}
                      style={[
                        styles.emotionChip,
                        selectedEmotions.includes(emotion.name) && styles.emotionChipActive
                      ]}
                      onPress={() => toggleEmotion(emotion.name)}
                    >
                      <Ionicons
                        name={emotion.icon as any}
                        size={14}
                        color={selectedEmotions.includes(emotion.name) ? '#FF1B7A' : '#94A3B8'}
                      />
                      <Text style={[
                        styles.emotionText,
                        selectedEmotions.includes(emotion.name) && styles.emotionTextActive
                      ]}>
                        {emotion.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {currentStep === 'result' && showResult && (
            <View style={styles.sectionContainer}>
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultMood}>
                    {getMoodEmoji(selectedMood)}
                  </Text>
                  <Text style={styles.resultTitle}>
                    You're feeling {getMoodLabel(selectedMood)}
                  </Text>
                  <Text style={styles.resultSubtitle}>
                    Intensity: {intensity}/10
                  </Text>
                </View>

                {selectedEmotions.length > 0 && (
                  <View style={styles.historyEmotions}>
                    {selectedEmotions.map((emotion, index) => (
                      <View key={index} style={styles.historyEmotion}>
                        <Text style={styles.historyEmotionText}>{emotion}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.insightSection}>
                  <Text style={styles.insightTitle}>Insights & Suggestions</Text>
                  {getInsights().map((insight, index) => (
                    <View key={index} style={styles.insightItem}>
                      <View style={styles.insightIcon}>
                        <Ionicons name="bulb" size={12} color="#00FF88" />
                      </View>
                      <Text style={styles.insightText}>{insight}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setCurrentStep('scan')}
                  >
                    <Ionicons name="refresh" size={16} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>New Scan</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.saveButton]}
                    onPress={saveEntry}
                  >
                    <Ionicons name="checkmark" size={16} color="#00FF88" />
                    <Text style={styles.actionButtonText}>Save Entry</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
