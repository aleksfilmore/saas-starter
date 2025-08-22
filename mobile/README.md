# Glitch Therapy Mobile App

React Native mobile application built with Expo that provides feature parity with the web application.

## Features

- **Authentication**: Sign in/up with email and password
- **Dashboard**: User stats, quick actions, and progress tracking
- **Daily Rituals**: Complete daily activities and earn bytes
- **Shop**: Spend bytes on rewards and items
- **Achievements**: Track progress and unlock achievements
- **Profile**: Manage user settings and view statistics

## Tech Stack

- **React Native 0.74.2**: Cross-platform mobile development
- **Expo 51.0.14**: Development platform and build tools
- **TypeScript**: Type-safe JavaScript
- **React Navigation 6.x**: Navigation and routing
- **Expo Notifications**: Push notifications and reminders
- **Expo SecureStore**: Secure token storage
- **Expo Linear Gradient**: Beautiful gradient backgrounds

## Project Structure

```
mobile/
├── App.tsx                 # Main app component
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
├── context/               # React contexts
│   ├── AuthContext.tsx    # Authentication state
│   ├── DataContext.tsx    # App data management
│   └── NotificationContext.tsx # Notifications
├── navigation/            # Navigation setup
│   ├── RootNavigator.tsx  # Main navigation container
│   ├── AuthNavigator.tsx  # Authentication flow
│   └── MainNavigator.tsx  # Main app tabs
└── screens/              # App screens
    ├── LoadingScreen.tsx  # Loading indicator
    ├── auth/             # Authentication screens
    │   ├── WelcomeScreen.tsx
    │   ├── SignInScreen.tsx
    │   └── SignUpScreen.tsx
    └── main/             # Main app screens
        ├── DashboardScreen.tsx
        ├── RitualsScreen.tsx
        ├── ShopScreen.tsx
        └── ProfileScreen.tsx
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   cd mobile
   npm install
   ```

2. **Install Expo CLI** (if not already installed):
   ```bash
   npm install -g @expo/cli
   ```

3. **Start Development Server**:
   ```bash
   npx expo start
   ```

4. **Run on Device**:
   - Download Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or use iOS Simulator/Android Emulator

## Development Notes

- **API Integration**: Update `API_BASE` in context files to match your backend URL
- **Styling**: Uses dark theme matching the web app's glitch-core aesthetic
- **Navigation**: Bottom tab navigation with authentication flow
- **State Management**: React Context for authentication, data, and notifications
- **Error Handling**: TypeScript errors are expected until dependencies are installed

## Next Steps

1. Install npm dependencies in the mobile directory
2. Configure API endpoints to match your backend
3. Test authentication flow with your API
4. Implement remaining screens (Rituals, Shop, Profile)
5. Add push notification setup
6. Configure app icons and splash screens
7. Test on physical devices
8. Set up EAS Build for production builds

## Dependencies to Install

```bash
# Core dependencies (already in package.json)
npm install expo@51.0.14 react-native@0.74.2

# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs

# Expo modules
npm install expo-status-bar expo-linear-gradient expo-notifications expo-secure-store @expo/vector-icons

# Additional utilities
npm install react-native-safe-area-context react-native-screens react-native-gesture-handler
```
