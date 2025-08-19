# 🚀 Healing Journey: Web + Mobile Platform

Cross-platform healing and wellness application with shared codebase for web and mobile.

## 📱 Mobile App Integration

### Quick Mobile Setup
```bash
# Windows
./setup-mobile.bat

# Mac/Linux
chmod +x setup-mobile.sh && ./setup-mobile.sh

# Manual
npm run mobile:setup
```

### Mobile Development
```bash
# Start mobile development server
npm run mobile:start

# Run on specific platform
npm run mobile:ios
npm run mobile:android
```

## 🏗️ Architecture Overview

### Shared Components (80% Code Reuse)
- **Authentication**: Unified session management
- **Database**: Single PostgreSQL database
- **API**: Shared REST endpoints
- **Business Logic**: Shared utility functions
- **State Management**: Consistent data models

### Platform-Specific
- **Web**: Next.js 15 with App Router
- **Mobile**: React Native with Expo SDK 51

## 📁 Project Structure

```
saas-starter/
├── app/                    # Next.js web app
├── lib/                    # Shared business logic
├── components/             # Shared UI components
├── mobile/                 # React Native mobile app
│   ├── app/               # Mobile screens
│   ├── components/        # Mobile-specific components
│   ├── lib/              # Mobile auth & API services
│   └── assets/           # Mobile assets
└── scripts/               # Build & deployment scripts
```

## 🔧 Development Workflow

### 1. Start Web Platform
```bash
npm run dev
# Runs on http://localhost:3001
```

### 2. Start Mobile App
```bash
npm run mobile:start
# Scan QR code with Expo Go app
```

### 3. Synchronized Development
- Changes to `lib/` affect both platforms
- API changes are immediately available to mobile
- Database changes sync across all clients

## 🔐 Authentication Flow

### Web Platform
- Lucia-based session cookies
- Secure server-side authentication
- CSRF protection

### Mobile App
- Bearer token authentication
- SecureStore for token persistence
- Biometric authentication support

### Shared Sessions
- Same user database
- Cross-platform session validation
- Seamless device switching

## 📱 Mobile Features

### Core Functionality
- ✅ User authentication & registration
- ✅ Dashboard with progress overview
- ✅ Daily rituals management
- ✅ Progress tracking & analytics
- ✅ Crisis support resources
- ✅ Push notifications
- ✅ Offline data caching

### Platform-Specific
- 📱 Biometric authentication
- 🔔 Push notifications for ritual reminders
- 📱 Native navigation patterns
- 💾 Offline-first architecture
- 📸 Camera integration for progress photos

## 🛠️ Tech Stack

### Web Platform
- **Framework**: Next.js 15
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: Lucia
- **Styling**: Tailwind CSS
- **Deployment**: Netlify

### Mobile App
- **Framework**: React Native + Expo
- **Navigation**: React Navigation 6
- **Storage**: AsyncStorage + SecureStore
- **Notifications**: Expo Notifications
- **Authentication**: Bearer tokens

## 🚀 Deployment

### Web Platform
```bash
npm run build
# Deploys to Netlify automatically
```

### Mobile App
```bash
# Development builds
npm run mobile:build:android
npm run mobile:build:ios

# Production submission
cd mobile && eas submit
```

## 🔄 Data Synchronization

### Real-time Sync
- Single source of truth (PostgreSQL)
- API-based communication
- Optimistic updates on mobile
- Conflict resolution strategies

### Offline Support
- Local data caching
- Queue pending changes
- Sync when connection restored
- Graceful degradation

## 🧪 Testing Strategy

### Shared Logic Testing
```bash
npm test
# Tests shared utilities and business logic
```

### Mobile Testing
```bash
cd mobile && npm test
# Tests mobile-specific components
```

### E2E Testing
- Web: Playwright
- Mobile: Detox

## 📊 Analytics & Monitoring

### Web Platform
- Performance monitoring
- User behavior tracking
- Error reporting (Sentry)

### Mobile App
- Crash reporting (Expo)
- Usage analytics
- Performance metrics

## 🔒 Security

### Data Protection
- HTTPS enforcement
- Secure token storage
- Input validation
- SQL injection prevention

### Privacy Compliance
- GDPR compliance
- User consent management
- Data minimization
- Right to deletion

## 🌟 Key Benefits

### For Users
- ✅ Seamless cross-device experience
- ✅ Offline mobile access
- ✅ Native mobile performance
- ✅ Consistent feature set
- ✅ Real-time synchronization

### For Developers
- ✅ 80% code reuse
- ✅ Unified API
- ✅ Single database
- ✅ Consistent deployment
- ✅ Reduced maintenance

## 📞 Getting Help

### Mobile Development Issues
1. Check Expo documentation
2. Verify device compatibility
3. Test on physical device
4. Check API connectivity

### Web Platform Issues
1. Check build logs
2. Verify environment variables
3. Test database connection
4. Review Netlify deployment

## 🛣️ Roadmap

### Phase 1: Core Features ✅
- Authentication system
- Basic mobile app structure
- API integration
- Core screens

### Phase 2: Enhanced Features 🔄
- Push notifications
- Offline synchronization
- Advanced animations
- Biometric authentication

### Phase 3: Advanced Features 📋
- Real-time messaging
- Voice journaling
- Video content
- Social features

---

**Ready to start your cross-platform healing journey? Run the setup commands above and start developing! 🚀**
