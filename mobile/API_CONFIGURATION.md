# 🔧 Mobile App API Configuration Guide

## Overview
The mobile app needs to connect to your backend API endpoints. Here's how to configure the API URLs correctly.

## 📍 Current Backend Structure
Your web app has these API endpoints available:
- `POST /api/auth/signin` - User authentication
- `POST /api/auth/signup` - User registration  
- `GET /api/auth/me` - Get current user info
- `GET /api/dashboard` - Dashboard data (user stats, rituals, bytes, streak)
- `GET /api/rituals/today` - Today's ritual
- `POST /api/rituals/complete` - Complete a ritual
- `GET /api/progress` - User progress data
- `GET /api/notifications` - User notifications

## 🎯 Step-by-Step Configuration

### 1. **For Local Development**
When testing locally with your dev server running on `http://localhost:3001`:

```typescript
// In mobile/context/AuthContext.tsx and DataContext.tsx
const API_BASE = __DEV__ 
  ? 'http://localhost:3001'  // Your local dev server
  : 'https://your-production-domain.com';
```

### 2. **For Production Deployment**
Replace `'https://your-production-domain.com'` with your actual Netlify domain:

```typescript
const API_BASE = __DEV__ 
  ? 'http://localhost:3001'
  : 'https://your-app-name.netlify.app'; // Your actual Netlify URL
```

### 3. **Environment-Specific Configuration**
For better control, you can use environment variables:

```typescript
// Create mobile/.env.local
EXPO_PUBLIC_API_URL_DEV=http://localhost:3001
EXPO_PUBLIC_API_URL_PROD=https://your-app-name.netlify.app

// Then in your context files:
const API_BASE = __DEV__ 
  ? process.env.EXPO_PUBLIC_API_URL_DEV 
  : process.env.EXPO_PUBLIC_API_URL_PROD;
```

## 🔗 API Endpoints Mapping

The mobile app context files are configured to use these endpoints:

### **AuthContext**
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signup` - Register new user  
- `GET /api/auth/me` - Verify authentication & get user data

### **DataContext**
- `GET /api/dashboard` - Get user dashboard data (bytes, streak, rituals)
- `GET /api/rituals/today` - Get today's ritual
- `POST /api/rituals/{id}/complete` - Complete a ritual
- `GET /api/actions/today` - Today's completed actions
- `GET /api/actions/recent` - Recent activity feed

## 🚀 Testing the Connection

### 1. **Start Your Dev Server**
```bash
# In the main project directory
npm run dev
# Server runs on http://localhost:3001
```

### 2. **Start Mobile App**
```bash
# In the mobile directory
cd mobile
npm install
npx expo start
```

### 3. **Test Authentication**
- Open mobile app in Expo Go
- Try signing in with existing credentials
- Check mobile app logs for API connection status

## 🔧 Troubleshooting

### **CORS Issues**
If you get CORS errors, you may need to configure CORS in your Next.js API:

```typescript
// In your API route files
export async function POST(request: NextRequest) {
  // Add CORS headers for mobile app
  const response = NextResponse.json(data);
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
```

### **Network Issues**
- **iOS Simulator**: Use `http://localhost:3001`
- **Android Emulator**: Use `http://10.0.2.2:3001` 
- **Physical Device**: Use your computer's IP address `http://192.168.1.XXX:3001`

### **Authentication Issues**
The mobile app uses different auth flow than web:
- Web app uses cookies/sessions
- Mobile app uses JWT tokens stored in SecureStore
- You may need to modify your auth endpoints to support both

## 📱 Mobile-Specific Considerations

### **Token-Based Authentication**
Unlike the web app which uses session cookies, the mobile app stores JWT tokens:

```typescript
// Store token after successful login
await SecureStore.setItemAsync('auth_token', data.token);

// Send token with requests
headers: {
  'Authorization': `Bearer ${token}`,
}
```

### **API Response Format**
Ensure your API responses match what the mobile app expects:

```typescript
// Expected user object format
interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  bytes: number;
  streak: number;
}
```

## 🎯 Next Steps

1. **Update API URLs**: Replace placeholder URLs with your actual domain
2. **Test Locally**: Start dev server and mobile app, test sign in
3. **Check Network**: Verify mobile device can reach your dev server
4. **Add Error Handling**: Implement proper error states in mobile UI
5. **Production Testing**: Test with your live Netlify deployment

## 📋 Quick Checklist

- [ ] Updated `API_BASE` in `AuthContext.tsx`
- [ ] Updated `API_BASE` in `DataContext.tsx` 
- [ ] Started dev server (`npm run dev`)
- [ ] Installed mobile dependencies (`npm install`)
- [ ] Tested sign in flow
- [ ] Verified API responses in mobile app
- [ ] Configured production URLs
- [ ] Tested on physical device
