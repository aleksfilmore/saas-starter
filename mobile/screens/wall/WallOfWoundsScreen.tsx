import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

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
    color: '#00FF88',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 27, 122, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  progressGradient: {
    padding: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  woundsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },
  woundCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  woundHealed: {
    backgroundColor: 'rgba(0, 255, 136, 0.05)',
    borderColor: 'rgba(0, 255, 136, 0.2)',
  },
  woundHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  woundInfo: {
    flex: 1,
  },
  woundTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  woundTitleHealed: {
    color: '#00FF88',
  },
  woundDate: {
    fontSize: 12,
    color: '#64748B',
  },
  healButton: {
    padding: 8,
  },
  woundDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 16,
  },
  woundMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  intensityLabel: {
    fontSize: 12,
    color: '#64748B',
    marginRight: 8,
  },
  intensityDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  intensityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 4,
  },
  healedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  healedText: {
    fontSize: 12,
    color: '#00FF88',
    marginLeft: 4,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalGradient: {
    paddingTop: 24,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalClose: {
    padding: 4,
  },
  modalForm: {
    paddingHorizontal: 24,
    paddingTop: 20,
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 48,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categorySelector: {
    marginTop: 8,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  categoryOptionActive: {
    backgroundColor: 'rgba(255, 27, 122, 0.1)',
  },
  categoryText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  intensitySlider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  intensityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

type Props = NativeStackScreenProps<any, 'WallOfWounds'>;

interface WoundEntry {
  id: string;
  title: string;
  description: string;
  category: 'betrayal' | 'loss' | 'trauma' | 'rejection' | 'abandonment' | 'other';
  intensity: number; // 1-10 scale
  date: Date;
  isHealed: boolean;
}

export function WallOfWoundsScreen({ navigation }: Props) {
  const [wounds, setWounds] = useState<WoundEntry[]>([
    {
      id: '1',
      title: 'Betrayal by close friend',
      description: 'Someone I trusted deeply broke that trust and shared my personal secrets',
      category: 'betrayal',
      intensity: 8,
      date: new Date('2024-01-15'),
      isHealed: false,
    },
    {
      id: '2',
      title: 'Loss of a loved one',
      description: 'The pain of losing someone who meant everything to me',
      category: 'loss',
      intensity: 10,
      date: new Date('2023-11-22'),
      isHealed: true,
    },
    {
      id: '3',
      title: 'Job rejection',
      description: 'Not getting the job I really wanted and feeling inadequate',
      category: 'rejection',
      intensity: 6,
      date: new Date('2024-03-10'),
      isHealed: true,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newWound, setNewWound] = useState({
    title: '',
    description: '',
    category: 'other' as WoundEntry['category'],
    intensity: 5,
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'betrayal': return '#FF1B7A';
      case 'loss': return '#8B5FE6';
      case 'trauma': return '#FF6B6B';
      case 'rejection': return '#FF9500';
      case 'abandonment': return '#00D4FF';
      case 'other': return '#94A3B8';
      default: return '#94A3B8';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'betrayal': return 'broken-heart';
      case 'loss': return 'sad';
      case 'trauma': return 'warning';
      case 'rejection': return 'close-circle';
      case 'abandonment': return 'person-remove';
      case 'other': return 'ellipsis-horizontal';
      default: return 'help';
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 8) return '#FF1B7A';
    if (intensity >= 6) return '#FF9500';
    if (intensity >= 4) return '#00D4FF';
    return '#22C55E';
  };

  const addWound = () => {
    if (!newWound.title.trim() || !newWound.description.trim()) {
      Alert.alert('Error', 'Please fill in both title and description');
      return;
    }

    const wound: WoundEntry = {
      id: Date.now().toString(),
      title: newWound.title.trim(),
      description: newWound.description.trim(),
      category: newWound.category,
      intensity: newWound.intensity,
      date: new Date(),
      isHealed: false,
    };

    setWounds(prev => [wound, ...prev]);
    setNewWound({
      title: '',
      description: '',
      category: 'other',
      intensity: 5,
    });
    setModalVisible(false);
    Alert.alert('Added', 'Your wound has been added to the wall. You\'re brave for acknowledging it.');
  };

  const toggleHealing = (woundId: string) => {
    setWounds(prev =>
      prev.map(wound =>
        wound.id === woundId ? { ...wound, isHealed: !wound.isHealed } : wound
      )
    );
  };

  const deleteWound = (woundId: string) => {
    Alert.alert(
      'Remove Wound',
      'Are you sure you want to remove this wound from your wall?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setWounds(prev => prev.filter(w => w.id !== woundId))
        }
      ]
    );
  };

  const healedWounds = wounds.filter(w => w.isHealed).length;
  const totalWounds = wounds.length;

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
            <Text style={styles.headerTitle}>Wall of Wounds</Text>
            <Text style={styles.headerSubtitle}>
              {healedWounds}/{totalWounds} wounds healing
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="#FF1B7A" />
          </TouchableOpacity>
        </View>

        {/* Healing Progress */}
        <View style={styles.progressCard}>
          <LinearGradient
            colors={['rgba(255, 27, 122, 0.1)', 'rgba(255, 27, 122, 0.05)']}
            style={styles.progressGradient}
          >
            <Text style={styles.progressTitle}>Healing Journey</Text>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={['#FF1B7A', '#8B5FE6']}
                style={[
                  styles.progressFill,
                  { width: totalWounds > 0 ? `${(healedWounds / totalWounds) * 100}%` : '0%' }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              You've acknowledged {totalWounds} wounds and are healing {healedWounds} of them
            </Text>
          </LinearGradient>
        </View>

        {/* Wounds List */}
        <ScrollView style={styles.woundsList}>
          {wounds.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={64} color="#64748B" />
              <Text style={styles.emptyTitle}>Your wall is empty</Text>
              <Text style={styles.emptyText}>
                Acknowledging wounds is the first step to healing. Tap the + button to add your first entry.
              </Text>
            </View>
          ) : (
            wounds.map((wound) => (
              <TouchableOpacity
                key={wound.id}
                style={[
                  styles.woundCard,
                  wound.isHealed && styles.woundHealed
                ]}
                onLongPress={() => deleteWound(wound.id)}
              >
                <View style={styles.woundHeader}>
                  <View style={[
                    styles.categoryIcon,
                    { backgroundColor: `${getCategoryColor(wound.category)}20` }
                  ]}>
                    <Ionicons
                      name={getCategoryIcon(wound.category) as any}
                      size={20}
                      color={getCategoryColor(wound.category)}
                    />
                  </View>
                  <View style={styles.woundInfo}>
                    <Text style={[
                      styles.woundTitle,
                      wound.isHealed && styles.woundTitleHealed
                    ]}>
                      {wound.title}
                    </Text>
                    <Text style={styles.woundDate}>
                      {wound.date.toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.healButton}
                    onPress={() => toggleHealing(wound.id)}
                  >
                    <Ionicons
                      name={wound.isHealed ? 'heart' : 'heart-outline'}
                      size={24}
                      color={wound.isHealed ? '#22C55E' : '#64748B'}
                    />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.woundDescription}>
                  {wound.description}
                </Text>
                
                <View style={styles.woundMeta}>
                  <View style={styles.intensityContainer}>
                    <Text style={styles.intensityLabel}>Intensity:</Text>
                    <View style={styles.intensityDots}>
                      {[...Array(10)].map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.intensityDot,
                            i < wound.intensity && {
                              backgroundColor: getIntensityColor(wound.intensity)
                            }
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                  {wound.isHealed && (
                    <View style={styles.healedBadge}>
                      <Ionicons name="checkmark" size={12} color="#22C55E" />
                      <Text style={styles.healedText}>Healing</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Add Wound Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <LinearGradient
                colors={['#080F20', '#1F2937']}
                style={styles.modalGradient}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add New Wound</Text>
                  <TouchableOpacity
                    style={styles.modalClose}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalForm}>
                  <Text style={styles.inputLabel}>Title</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newWound.title}
                    onChangeText={(text) => setNewWound(prev => ({ ...prev, title: text }))}
                    placeholder="Give your wound a name..."
                    placeholderTextColor="#64748B"
                    maxLength={100}
                  />

                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={newWound.description}
                    onChangeText={(text) => setNewWound(prev => ({ ...prev, description: text }))}
                    placeholder="Describe what happened and how it affected you..."
                    placeholderTextColor="#64748B"
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                  />

                  <Text style={styles.inputLabel}>Category</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelector}>
                    {(['betrayal', 'loss', 'trauma', 'rejection', 'abandonment', 'other'] as const).map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryOption,
                          newWound.category === category && styles.categoryOptionActive,
                          { borderColor: getCategoryColor(category) }
                        ]}
                        onPress={() => setNewWound(prev => ({ ...prev, category }))}
                      >
                        <Ionicons
                          name={getCategoryIcon(category) as any}
                          size={20}
                          color={newWound.category === category ? getCategoryColor(category) : '#64748B'}
                        />
                        <Text style={[
                          styles.categoryText,
                          newWound.category === category && { color: getCategoryColor(category) }
                        ]}>
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={styles.inputLabel}>
                    Intensity: {newWound.intensity}/10
                  </Text>
                  <View style={styles.intensitySlider}>
                    {[...Array(10)].map((_, i) => (
                      <TouchableOpacity
                        key={i}
                        style={[
                          styles.intensityButton,
                          i < newWound.intensity && {
                            backgroundColor: getIntensityColor(newWound.intensity)
                          }
                        ]}
                        onPress={() => setNewWound(prev => ({ ...prev, intensity: i + 1 }))}
                      />
                    ))}
                  </View>
                </ScrollView>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={addWound}
                  >
                    <LinearGradient
                      colors={['#FF1B7A', '#8B5FE6']}
                      style={styles.saveButtonGradient}
                    >
                      <Text style={styles.saveButtonText}>Add to Wall</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}
