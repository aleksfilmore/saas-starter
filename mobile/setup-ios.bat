@echo off
REM CTRL+ALT+BLOCK Mobile - iOS Development Setup Script (Windows)
REM This script helps you set up iOS development credentials

echo 🍎 CTRL+ALT+BLOCK iOS Development Setup
echo =======================================
echo.

REM Check if we're in the mobile directory
if not exist "app.json" (
    echo ❌ Error: This script must be run from the mobile\ directory
    echo    Please run from the mobile folder
    pause
    exit /b 1
)

REM Create credentials directory if it doesn't exist
if not exist "credentials" mkdir credentials

echo 📋 iOS Development Checklist:
echo.
echo □ Apple Developer Account ($99/year)
echo □ App ID created: com.ctrlaltblock.app
echo □ iOS Distribution Certificate (.p12)
echo □ App Store Connect API Key (.p8)
echo □ Provisioning Profile (.mobileprovision)
echo.

echo 🔧 Setting up credentials structure...

REM Check if EAS CLI is installed
eas --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing EAS CLI...
    npm install -g @expo/eas-cli
) else (
    echo ✅ EAS CLI already installed
)

echo.
echo 🔐 Checking Expo authentication...
eas whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  You need to log into Expo first:
    echo    Run: eas login
    echo.
    set /p "login=Would you like to login now? (y/n): "
    if /i "%login%"=="y" (
        eas login
    )
) else (
    echo ✅ Logged into Expo
)

echo.
echo 📱 Next Steps:
echo.
echo 1. Get iOS credentials from Apple Developer Portal:
echo    → https://developer.apple.com/account/resources/
echo.
echo 2. Place your credentials in the credentials\ folder:
echo    • AuthKey_XXXXXXXXX.p8 (App Store Connect API Key)
echo    • distribution_certificate.p12 (iOS Distribution Certificate)
echo    • CtrlAltBlock_Development.mobileprovision (Provisioning Profile)
echo.
echo 3. Update credentials.json with your actual values:
echo    • Key ID from your .p8 file
echo    • Team ID from Apple Developer Portal
echo    • Certificate password for .p12 file
echo.
echo 4. Test your setup:
echo    npx eas build --platform ios --profile development
echo.
echo 5. For production builds:
echo    npx eas build --platform ios --profile production
echo.

REM Check if credentials exist
echo 🔍 Checking current credentials...
if exist "credentials.json" (
    echo ✅ credentials.json exists
) else (
    echo ⚠️  credentials.json not found
)

if exist "credentials" (
    dir /b credentials\*.p8 credentials\*.p12 credentials\*.mobileprovision >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Found credential files in credentials\ folder
    ) else (
        echo ⚠️  No credential files found in credentials\ folder
    )
) else (
    echo ⚠️  credentials\ folder not found
)

echo.
echo 📚 Documentation:
echo    • iOS credentials guide: .\credentials\README.md
echo    • Expo documentation: https://docs.expo.dev/app-signing/app-credentials/
echo    • Apple Developer: https://developer.apple.com/documentation/
echo.
echo 🎯 Ready to build! Run this when credentials are ready:
echo    npx eas build --platform ios --profile development
echo.
pause
