# 📱 Healing Journey Mobile App

React Native mobile app that shares 80%+ codebase with the web platform, providing a seamless cross-platform experience.

## 🚀 Quick Start

### Windows Users
```bash
./setup-mobile.bat
```

### Mac/Linux Users  
```bash
chmod +x setup-mobile.sh
./setup-mobile.sh
```

### Manual Setup
```bash
cd mobile
npm install
npm install -g @expo/cli
expo start
```

## 🏗️ Architecture

### Shared Services (80% Code Reuse)
- **Authentication**: `lib/auth/mobile-auth.ts`
- **API Service**: `lib/api-service.ts` 
- **Database Models**: `../lib/db/actual-schema.ts`
- **Business Logic**: `../lib/rituals/`, `../lib/gamification/`
- **Utilities**: `../lib/utils.ts`

### Mobile-Specific Components
- **Navigation**: React Navigation with bottom tabs
- **UI Components**: React Native optimized components
- **Push Notifications**: Expo Notifications
- **Offline Storage**: AsyncStorage + SecureStore
- **Biometric Auth**: Expo Local Authentication

## 📁 Project Structure

```
mobile/
├── app/                 # Expo Router app directory
├── components/          # Reusable UI components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── context/           # React contexts (Auth, etc.)
├── services/          # Mobile-specific services
├── lib/               # Shared business logic
└── assets/            # Images, fonts, icons
```

## 🔧 Development

### Start Development Server
```bash
cd mobile
expo start
```

### Run on Device
1. Install **Expo Go** on your phone
2. Scan QR code from terminal
3. App will load automatically

### Run on Simulator
```bash
# iOS Simulator
expo start --ios

# Android Emulator  
expo start --android
```

## 🎯 Key Features

### 🔐 Authentication
- Secure token-based auth with web platform sync
- Biometric authentication (Face ID/Touch ID)
- Session persistence across app restarts

### 📱 Core Screens
- **Dashboard**: Progress overview, quick actions
- **Rituals**: Daily rituals, tracking, completion
- **Progress**: Streaks, XP, achievements, analytics
- **Profile**: User settings, preferences
- **Crisis Support**: Emergency resources, contacts

### 🔔 Push Notifications
- Ritual reminders
- Streak maintenance alerts
- Achievement notifications
- Crisis support check-ins

### 💾 Offline Support
- Local data caching
- Sync when online
- Offline-first architecture

## 🚢 Deployment

### Production Builds
```bash
# Android
eas build --platform android

# iOS
eas build --platform ios
```

### App Store Submission
```bash
# Android Play Store
eas submit --platform android

# iOS App Store
eas submit --platform ios
```

## 🔗 Web Platform Integration

### Shared Authentication
Mobile app uses same session tokens as web platform, allowing users to seamlessly switch between devices.

### API Endpoints
All mobile requests go through existing web platform API routes:
- `/api/auth/*` - Authentication
- `/api/rituals/*` - Ritual management
- `/api/progress/*` - Progress tracking
- `/api/users/*` - User management

### Database Sync
Mobile app connects to same PostgreSQL database as web platform, ensuring real-time data consistency.

## ⚙️ Configuration

### Environment Variables
```bash
EXPO_PUBLIC_API_URL=https://your-domain.com
EXPO_PUBLIC_WEB_URL=https://your-domain.com
EXPO_PUBLIC_ENVIRONMENT=production
```

### App Store Metadata
- **Bundle ID**: `com.healingjourney.app`
- **App Name**: Healing Journey
- **Category**: Health & Fitness
- **Privacy Policy**: Required for store approval

## 🛠️ Tech Stack

- **Framework**: React Native with Expo SDK 51
- **Navigation**: React Navigation 6
- **State Management**: React Context + AsyncStorage
- **Authentication**: Shared with web platform
- **Notifications**: Expo Notifications
- **Storage**: Expo SecureStore + AsyncStorage
- **Styling**: StyleSheet with brand colors
- **TypeScript**: Full type safety

## 🔒 Security

### Data Protection
- Sensitive data stored in SecureStore
- Session tokens encrypted
- Biometric authentication for app access

### Privacy Compliance
- GDPR compliant data handling
- User consent for notifications
- Secure data transmission (HTTPS only)

## 📊 Analytics & Monitoring

### User Engagement
- Screen view tracking
- Feature usage analytics
- Crash reporting via Expo

### Performance Monitoring  
- App load times
- API response times
- Memory usage optimization

## 🎨 Design System

Uses same brand identity as web platform:
- **Primary**: `#8B5FE6` (Purple)
- **Secondary**: `#FF1B7A` (Pink)
- **Accent**: `#00D4FF` (Cyan)
- **Success**: `#00FF88` (Green)
- **Background**: `#080F20` (Dark)

## 🧪 Testing

```bash
# Run tests
npm test

# E2E testing with Detox
npm run test:e2e
```

## 📞 Support

For mobile-specific issues:
1. Check Expo documentation
2. Verify device compatibility
3. Test on physical device
4. Check network connectivity
