import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'AITherapy'>;

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function AITherapyScreen({ navigation }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI therapy companion. I'm here to listen and support you through your healing journey. How are you feeling today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const therapyResponses = [
    "I hear you, and I want you to know that your feelings are completely valid. Can you tell me more about what's weighing on your heart?",
    "That sounds really challenging. You're being so brave by sharing this with me. What would feel most supportive for you right now?",
    "Thank you for trusting me with your experience. It takes courage to open up about difficult emotions. How long have you been feeling this way?",
    "I can sense the pain in your words. You're not alone in this journey. What small step could you take today to care for yourself?",
    "Your healing journey is unique and important. Sometimes just talking about our feelings can be the first step toward healing. What brings you even a tiny bit of comfort?",
    "I notice you're going through a lot right now. It's okay to feel overwhelmed. What has helped you cope with difficult times in the past?",
    "You're showing such strength by reaching out. Healing isn't linear, and it's okay to have ups and downs. What would you like to focus on in our conversation today?",
    "I appreciate you sharing your vulnerability with me. Your experiences matter. Is there a particular aspect of your healing that you'd like to explore together?",
  ];

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: therapyResponses[Math.floor(Math.random() * therapyResponses.length)],
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear the entire conversation? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive', 
          onPress: () => {
            setMessages([
              {
                id: '1',
                text: "Hello! I'm your AI therapy companion. I'm here to listen and support you through your healing journey. How are you feeling today?",
                isUser: false,
                timestamp: new Date(),
              },
            ]);
          }
        },
      ]
    );
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
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
            <Ionicons name="arrow-back" size={24} color="#00D4FF" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>AI Therapy</Text>
            <Text style={styles.headerSubtitle}>Your healing companion</Text>
          </View>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearChat}
          >
            <Ionicons name="refresh" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Messages */}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.isUser ? styles.userMessage : styles.aiMessage
                ]}
              >
                {!message.isUser && (
                  <View style={styles.aiAvatar}>
                    <Ionicons name="sparkles" size={16} color="#00D4FF" />
                  </View>
                )}
                <View style={[
                  styles.messageBubble,
                  message.isUser ? styles.userBubble : styles.aiBubble
                ]}>
                  <Text style={[
                    styles.messageText,
                    message.isUser ? styles.userText : styles.aiText
                  ]}>
                    {message.text}
                  </Text>
                  <Text style={[
                    styles.messageTime,
                    message.isUser ? styles.userTime : styles.aiTime
                  ]}>
                    {formatTime(message.timestamp)}
                  </Text>
                </View>
                {message.isUser && (
                  <View style={styles.userAvatar}>
                    <Ionicons name="person" size={16} color="#8B5FE6" />
                  </View>
                )}
              </View>
            ))}
            
            {isTyping && (
              <View style={[styles.messageContainer, styles.aiMessage]}>
                <View style={styles.aiAvatar}>
                  <Ionicons name="sparkles" size={16} color="#00D4FF" />
                </View>
                <View style={[styles.messageBubble, styles.aiBubble]}>
                  <View style={styles.typingIndicator}>
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Share what's on your mind..."
                placeholderTextColor="#64748B"
                multiline
                maxLength={500}
                onSubmitEditing={sendMessage}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
                ]}
                onPress={sendMessage}
                disabled={!inputText.trim() || isTyping}
              >
                <Ionicons 
                  name="send" 
                  size={20} 
                  color={inputText.trim() ? '#FFFFFF' : '#64748B'} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#00D4FF',
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 95, 230, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 18,
    padding: 12,
  },
  aiBubble: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: 'rgba(139, 95, 230, 0.2)',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  aiText: {
    color: '#F8FAFC',
  },
  userText: {
    color: '#F8FAFC',
  },
  messageTime: {
    fontSize: 11,
    opacity: 0.7,
  },
  aiTime: {
    color: '#00D4FF',
  },
  userTime: {
    color: '#8B5FE6',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00D4FF',
    marginHorizontal: 2,
    opacity: 0.4,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#F8FAFC',
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 12,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#00D4FF',
  },
  sendButtonInactive: {
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
  },
});
