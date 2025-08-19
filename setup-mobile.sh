#!/bin/bash

echo "🚀 Setting up Healing Journey Mobile App..."

# Navigate to mobile directory
cd mobile

# Install dependencies
echo "📦 Installing mobile app dependencies..."
npm install

# Install Expo CLI globally if not already installed
if ! command -v expo &> /dev/null; then
    echo "📱 Installing Expo CLI..."
    npm install -g @expo/cli
fi

# Create environment file
echo "⚙️ Creating environment configuration..."
cat > .env << EOL
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_WEB_URL=http://localhost:3001
EXPO_PUBLIC_ENVIRONMENT=development
EOL

echo "✅ Mobile app setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start your web platform: npm run dev"
echo "2. In another terminal, start mobile app: cd mobile && expo start"
echo "3. Install Expo Go on your phone"
echo "4. Scan the QR code to run the app"
echo ""
echo "📱 For production builds:"
echo "• Android: expo build:android"
echo "• iOS: expo build:ios"
