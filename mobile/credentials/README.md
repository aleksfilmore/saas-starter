# iOS Development Credentials Setup

## Required Files for iOS Development

To build and distribute the CTRL+ALT+BLOCK iOS app, you need the following credentials from your Apple Developer account:

### 1. App Store Connect API Key (.p8 file)
- **File**: `AuthKey_XXXXXXXXX.p8`
- **Location**: Place in `./credentials/` folder
- **Purpose**: Used for app store operations and push notifications
- **How to get**:
  1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
  2. Users and Access → Integrations → App Store Connect API
  3. Generate new key with App Manager role
  4. Download the `.p8` file
  5. Note the Key ID and Issuer ID

### 2. Distribution Certificate (.p12 file)
- **File**: `distribution_certificate.p12`
- **Location**: Place in `./credentials/` folder
- **Purpose**: Code signing for App Store distribution
- **How to get**:
  1. Go to [Apple Developer Portal](https://developer.apple.com/)
  2. Certificates, Identifiers & Profiles → Certificates
  3. Create iOS Distribution certificate
  4. Download and export as .p12 from Keychain Access

### 3. Provisioning Profile (.mobileprovision)
- **File**: `CtrlAltBlock_Development.mobileprovision`
- **Location**: Place in `./credentials/` folder
- **Purpose**: Links your app ID, devices, and certificates
- **How to get**:
  1. Go to Apple Developer Portal
  2. Certificates, Identifiers & Profiles → Profiles
  3. Create iOS App Development or App Store profile
  4. Select your app ID: `com.ctrlaltblock.app`

## Setup Instructions

1. **Create App ID** (if not exists):
   - Bundle ID: `com.ctrlaltblock.app`
   - Enable capabilities: Push Notifications, App Groups

2. **Update credentials.json**:
   ```json
   {
     "ios": {
       "provisioningProfilePath": "./credentials/CtrlAltBlock_Development.mobileprovision",
       "distributionCertificate": {
         "path": "./credentials/distribution_certificate.p12",
         "password": "your_actual_password"
       },
       "pushKey": {
         "path": "./credentials/AuthKey_YOURKEY.p8",
         "keyId": "YOUR_KEY_ID",
         "teamId": "YOUR_TEAM_ID"
       }
     }
   }
   ```

3. **Environment Variables** (optional, for CI/CD):
   ```bash
   APPLE_TEAM_ID=XXXXXXXXX
   APPLE_KEY_ID=XXXXXXXXX
   APPLE_ISSUER_ID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
   ```

## Build Commands

After adding credentials:

```bash
# Development build
npx eas build --platform ios --profile development

# Preview build (TestFlight)
npx eas build --platform ios --profile preview

# Production build (App Store)
npx eas build --platform ios --profile production
```

## Security Notes

- ⚠️ **Never commit credentials to git**
- Add `credentials/` to `.gitignore`
- Use environment variables for CI/CD
- Rotate keys regularly
- Keep certificate passwords secure

## Testing Without Credentials

For development and testing, you can:
1. Use iOS Simulator (no credentials needed)
2. Use Expo Go app for quick testing
3. Create development builds later when credentials are ready

## App Store Information

- **App Name**: CTRL+ALT+BLOCK
- **Bundle ID**: com.ctrlaltblock.app
- **Team**: ctrlaltblock
- **Primary Category**: Health & Fitness
- **Content Rating**: 17+ (Mature/Suggestive Themes)
