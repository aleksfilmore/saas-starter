#!/bin/bash

# CTRL+ALT+BLOCK Mobile - iOS Development Setup Script
# This script helps you set up iOS development credentials

echo "🍎 CTRL+ALT+BLOCK iOS Development Setup"
echo "======================================="
echo ""

# Check if we're in the mobile directory
if [ ! -f "app.json" ]; then
    echo "❌ Error: This script must be run from the mobile/ directory"
    echo "   Please run: cd mobile && ./setup-ios.sh"
    exit 1
fi

# Create credentials directory if it doesn't exist
mkdir -p credentials

echo "📋 iOS Development Checklist:"
echo ""
echo "□ Apple Developer Account ($99/year)"
echo "□ App ID created: com.ctrlaltblock.app"
echo "□ iOS Distribution Certificate (.p12)"
echo "□ App Store Connect API Key (.p8)"
echo "□ Provisioning Profile (.mobileprovision)"
echo ""

echo "🔧 Setting up credentials structure..."

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g @expo/eas-cli
else
    echo "✅ EAS CLI already installed"
fi

# Check if user is logged into Expo
echo ""
echo "🔐 Checking Expo authentication..."
if ! eas whoami &> /dev/null; then
    echo "⚠️  You need to log into Expo first:"
    echo "   Run: eas login"
    echo ""
    read -p "Would you like to login now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        eas login
    fi
else
    echo "✅ Logged into Expo as: $(eas whoami)"
fi

echo ""
echo "📱 Next Steps:"
echo ""
echo "1. Get iOS credentials from Apple Developer Portal:"
echo "   → https://developer.apple.com/account/resources/"
echo ""
echo "2. Place your credentials in the credentials/ folder:"
echo "   • AuthKey_XXXXXXXXX.p8 (App Store Connect API Key)"
echo "   • distribution_certificate.p12 (iOS Distribution Certificate)"
echo "   • CtrlAltBlock_Development.mobileprovision (Provisioning Profile)"
echo ""
echo "3. Update credentials.json with your actual values:"
echo "   • Key ID from your .p8 file"
echo "   • Team ID from Apple Developer Portal"
echo "   • Certificate password for .p12 file"
echo ""
echo "4. Test your setup:"
echo "   npx eas build --platform ios --profile development"
echo ""
echo "5. For production builds:"
echo "   npx eas build --platform ios --profile production"
echo ""

# Check if credentials exist
echo "🔍 Checking current credentials..."
if [ -f "credentials.json" ]; then
    echo "✅ credentials.json exists"
else
    echo "⚠️  credentials.json not found"
fi

if [ -d "credentials" ]; then
    credential_count=$(ls -1 credentials/*.p8 credentials/*.p12 credentials/*.mobileprovision 2>/dev/null | wc -l)
    if [ $credential_count -gt 0 ]; then
        echo "✅ Found $credential_count credential file(s) in credentials/ folder"
    else
        echo "⚠️  No credential files found in credentials/ folder"
    fi
else
    echo "⚠️  credentials/ folder not found"
fi

echo ""
echo "📚 Documentation:"
echo "   • iOS credentials guide: ./credentials/README.md"
echo "   • Expo documentation: https://docs.expo.dev/app-signing/app-credentials/"
echo "   • Apple Developer: https://developer.apple.com/documentation/"
echo ""
echo "🎯 Ready to build! Run this when credentials are ready:"
echo "   npx eas build --platform ios --profile development"
echo ""
