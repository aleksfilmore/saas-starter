@echo off
echo 🚀 Setting up Healing Journey Mobile App...

cd mobile

echo 📦 Installing mobile app dependencies...
npm install

echo 📱 Installing Expo CLI globally...
npm install -g @expo/cli

echo ⚙️ Creating environment configuration...
echo EXPO_PUBLIC_API_URL=http://localhost:3001 > .env
echo EXPO_PUBLIC_WEB_URL=http://localhost:3001 >> .env
echo EXPO_PUBLIC_ENVIRONMENT=development >> .env

echo ✅ Mobile app setup complete!
echo.
echo 🎯 Next steps:
echo 1. Start your web platform: npm run dev
echo 2. In another terminal, start mobile app: cd mobile ^&^& expo start
echo 3. Install Expo Go on your phone
echo 4. Scan the QR code to run the app
echo.
echo 📱 For production builds:
echo • Android: expo build:android
echo • iOS: expo build:ios

pause
