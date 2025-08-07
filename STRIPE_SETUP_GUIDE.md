# Stripe Subscription Integration - Setup Guide

## ✅ Implementation Complete

Your SaaS starter now has a complete Stripe subscription system with two tiers:
- **👻 Ghost Mode (Free)** - Basic features
- **🔥 Firewall Mode ($9.99/month)** - Premium features with unlimited access

## 🔧 Required Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_...  # Your Stripe publishable key
STRIPE_WEBHOOK_SECRET=whsec_...  # Webhook endpoint secret
STRIPE_FIREWALL_PRICE_ID=price_...  # Price ID for $9.99/month plan

# Next.js App URL (for Stripe redirects)
NEXT_PUBLIC_APP_URL=https://ctrlalblock.com  # Your production URL
```

## 🚀 Stripe Dashboard Setup

### 1. Create Product & Price ✅
**Your product is configured:**
- **Name**: "🔥 Firewall Mode" 
- **Price**: $9.99/month

### 2. Setup Webhook ✅ 
**Your webhook is configured:**
- **Endpoint**: `https://ctrlalblock.com/api/stripe/webhook`
- **Name**: CTRL+ALT+BLOCK
- **API Version**: 2025-06-30.basil
- **Events**: 5 selected (appears to be configured correctly)

**Next steps:**
1. Copy the webhook signing secret from your Stripe dashboard
2. Add it to your `.env.local` file as `STRIPE_WEBHOOK_SECRET=whsec_...`
3. Ensure these events are selected:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## 📁 Files Created/Updated

### Core Stripe Integration
- ✅ `lib/stripe/config.ts` - Subscription plans & feature gates
- ✅ `lib/stripe/subscription.ts` - Subscription management functions
- ✅ `lib/stripe/client.ts` - Stripe client configuration

### API Routes
- ✅ `app/api/stripe/checkout/route.ts` - Create checkout sessions
- ✅ `app/api/stripe/portal/route.ts` - Customer portal access
- ✅ `app/api/stripe/webhook/route.ts` - Handle Stripe events
- ✅ `app/api/stripe/subscription/route.ts` - Get subscription status

### UI Components
- ✅ `components/paywall/Paywall.tsx` - Feature gating component
- ✅ `components/subscription/SubscriptionManager.tsx` - Subscription dashboard

## 🎯 Features by Tier

### 👻 Ghost Mode (Free)
- No-Contact Tracker (24h shield window)
- 1 ritual per day
- Max level 15
- AI Therapy ($3.99/session, 300 msgs)
- Basic features only

### 🔥 Firewall Mode ($9.99/month)
- No-Contact Tracker (48h shield + auto-shield)
- 2 rituals/day (archetype-weighted)
- Unlimited levels & XP
- AI Therapy included (1,000 msgs/month)
- AI Voice Therapy ($4.99/15 min)
- Wall of Wounds™ posting & editing
- Unlimited ritual rerolls
- All badges & secret quests

## 🔐 Usage Examples

### Protect Features with Paywall
```tsx
import { withPaywall } from '@/components/paywall/Paywall';

const PremiumFeature = withPaywall(
  () => <div>Premium content here</div>,
  'wallPosting'
);
```

### Check Feature Access
```tsx
import { hasFeatureAccess } from '@/lib/stripe/config';

const canPost = hasFeatureAccess(userTier, 'wallPosting');
```

### Add Subscription Manager to Dashboard
```tsx
import { SubscriptionManager } from '@/components/subscription/SubscriptionManager';

// In your dashboard component
<SubscriptionManager />
```

## 🧪 Testing

1. Use Stripe test mode for development
2. Test card: `4242 4242 4242 4242`
3. Use test webhook events in Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

## 🚀 Going Live

1. Switch to live Stripe keys
2. Update webhook URL to production domain
3. Test payment flow end-to-end
4. Update `NEXT_PUBLIC_APP_URL` to production URL

---

**Status**: ✅ Ready for deployment and testing!
